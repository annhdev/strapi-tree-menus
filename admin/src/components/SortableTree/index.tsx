import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Announcements,
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  DropAnimation,
  Modifier,
  defaultDropAnimation,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  buildTree,
  flattenTree,
  getProjection,
  getChildCount,
  removeItem,
  setProperty,
} from './utilities';
import type { FlattenedItem, SensorContext, TreeItems } from '../../types';
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import { SortableTreeItem } from './components';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { useIntl } from 'react-intl';
import useTreeData from '../../hooks/useTreeData';
import { cloneDeep } from 'lodash';
import { ValidationError } from 'yup';

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface Props {
  collapsible?: boolean;
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

export function SortableTree({ collapsible, indicator = false, indentationWidth = 50, removable }: Props) {

  const { flattenedItems, activeId, setActiveId, items, setItems, disabled, setActiveItem, onChange, validate } = useTreeData();

  const { formatMessage } = useIntl();
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{ parentId: UniqueIdentifier | null; overId: UniqueIdentifier; } | null>(null);


  const projected = activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth) : null;
  const sensorContext: SensorContext = useRef({ items: flattenedItems, offset: offsetLeft });
  const [coordinateGetter] = useState(() => sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth));
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter }));

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeSelectedItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;


  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement('onDragMove', active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement('onDragOver', active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement('onDragEnd', active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, title, errors, children, collapsed, depth }) => {
          return (
            <SortableTreeItem
              key={id}
              id={id}
              value={title as any}
              errors={errors}
              depth={id === activeId && projected ? projected.depth : depth}
              indentationWidth={indentationWidth}
              indicator={indicator}
              collapsed={Boolean(collapsed && children.length)}
              onCollapse={
                collapsible && children.length
                  ? () => handleCollapse(id)
                  : undefined
              }
              onRemove={removable ? () => handleRemove(id) : undefined}
              onEdit={() => handleEditItem(id)}
              onAdd={() => handleAddItem(id)}
              disabled={disabled}
            />
          );
        })}
        <Button size="sm" startIcon={<Plus />} variant={'secondary'} paddingTop={2} paddingBottom={2} onClick={() => handleAddItem()}>
          {formatMessage({
            id: 'tree-menus.add-new-item',
            defaultMessage: 'Add new item',
          })
          }
        </Button>
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeSelectedItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeSelectedItem.depth}
                clone
                childCount={getChildCount(items, activeId) + 1}
                value={activeId.toString()}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({ parentId: activeItem.parentId, overId: activeId });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
      onChange(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(undefined);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function handleRemove(id: UniqueIdentifier) {
    const newItems = removeItem(cloneDeep(items), id);
    setItems(newItems);
    onChange(newItems);
  }

  function handleCollapse(id: UniqueIdentifier) {
    let newItems = setProperty(cloneDeep(items), id, 'collapsed', (value) => {
      return !value;
    });
    setItems(newItems);
    onChange(newItems);
  }

  function getMovementAnnouncement(eventName: string, activeId: UniqueIdentifier, overId?: UniqueIdentifier) {
    if (overId && projected) {
      if (eventName !== 'onDragEnd') {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === 'onDragEnd' ? 'dropped' : 'moved';
      const nestedVerb = eventName === 'onDragEnd' ? 'dropped' : 'nested';

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }

  async function handleAddItem(parentId: UniqueIdentifier | null = null) {

    let _items: TreeItems = cloneDeep(items);
    if (!parentId) {
      let newItem = {
        id: `${_items.length + 1}`,
        title: `New ${_items.length + 1}`,
        url: '/',
        target: '_self',
        isProtected: true,
        children: [],
      };
      _items.push(newItem);
    } else {
      let parentItem = flattenedItems.find(item => item.id === parentId);
      if (parentItem) {
        const clonedItems: FlattenedItem[] = JSON.parse(
          JSON.stringify(flattenTree(_items)),
        );

        clonedItems.push({
          id: `${parentId}.${parentItem.children.length + 1}`,
          title: `New ${parentId}.${parentItem.children.length + 1}`,
          url: '/',
          target: '_self',
          isProtected: true,
          children: [],
          depth: parentItem.depth + 1,
          index: parentItem.children.length,
          parentId: parentItem.id,
        });
        _items = buildTree(clonedItems);
      }
    }

    let result = await validate(_items);
    setItems(result.data);

    if (!result.errors) {
      onChange(result.data);
    } else {
      throw new ValidationError(result.errors);
    }
  }

  function handleEditItem(id: UniqueIdentifier) {
    let activeItem = flattenedItems.find(({ id: _id }) => _id === id);
    setActiveItem(activeItem);
  }

}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
