import React, { CSSProperties } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TreeItem, Props as TreeItemProps } from './TreeItem';
import { iOS } from '../../utilities';

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
  disabled?: boolean;
  errors?: any;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) => !(isSorting || wasDragging);

export function SortableTreeItem({ id, depth, disabled, errors, ...props }: Props) {
  const { attributes, isDragging, isSorting, listeners, setDraggableNodeRef, setDroppableNodeRef, transform, transition } = useSortable({ id, animateLayoutChanges, disabled: disabled });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (errors) {
    style.border = '1px solid red';
  }

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      disableInteraction={isSorting}
      disabled={disabled}
      errors={errors}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}
