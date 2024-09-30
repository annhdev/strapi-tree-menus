import React, {forwardRef, HTMLAttributes} from 'react';
import classNames from 'classnames';

import {Action, Handle, Remove} from '../index';
import styled from "styled-components";
import {Edit} from "../Edit";
import {Add} from "../Add";
import { Typography } from '@strapi/design-system';

const Wrapper = styled.li`
  list-style: none;
  box-sizing: border-box;
  padding-left: var(--spacing);
  margin-bottom: -1px;

  &.clone {
    display: inline-block;
    pointer-events: none;
    padding: 5px 0 0 10px;

    .TreeItem {
      --vertical-padding: 5px;

      padding-right: 24px;
      border-radius: 4px;
      box-shadow: 0 15px 15px 0 rgba(34, 33, 81, 0.1);
    }
  }

  &.ghost {
    &.indicator {
      opacity: 1;
      position: relative;
      z-index: 1;
      margin-bottom: -1px;

      .TreeItem {
        position: relative;
        padding: 0;
        height: 8px;
        border-color: #2389ff;
        background-color: #56a1f8;

        &:before {
          position: absolute;
          left: -8px;
          top: -4px;
          display: block;
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid #2389ff;
          background-color: #ffffff;
        }

        > * {
          /* Items are hidden using height and opacity to retain focus */
          opacity: 0;
          height: 0;
        }
      }
    }

    &:not(.indicator) {
      opacity: 0.5;
    }

    .TreeItem > * {
      box-shadow: none;
      background-color: transparent;
    }
  }

  .TreeItem {
    --vertical-padding: 10px;

    position: relative;
    display: flex;
    align-items: center;
    padding: var(--vertical-padding) 10px;
    background-color: #fff;
    border: 1px solid #dedede;
    color: #222;
    box-sizing: border-box;
  }

  .Text {
    flex-grow: 1;
    padding-left: 0.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .Count {
    position: absolute;
    top: -10px;
    right: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #2389ff;
    font-size: 0.8rem;
    font-weight: 600;
    color: #fff;
  }

  .disableInteraction {
    pointer-events: none;
  }

  .disableSelection,
  .clone {
    .Text,
    .Count {
      user-select: none;
      -webkit-user-select: none;
    }
  }

  .Collapse {
    svg {
      transition: transform 250ms ease;
    }

    &.collapsed svg {
      transform: rotate(-90deg);
    }
  }
`;

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  disabled?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: string;
  errors?: any;

  onCollapse?(): void;

  onRemove?(): void;

  onEdit?(): void;

  onAdd?(): void;

  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(({childCount,errors, clone, depth, disableSelection, disableInteraction,disabled, ghost, handleProps, indentationWidth, indicator, collapsed, onCollapse, onRemove, onEdit, onAdd, style, value, wrapperRef, ...props}, ref) => {
    return (
      <Wrapper
        className={classNames(
          'Wrapper',
          clone && 'clone',
          ghost && 'ghost',
          indicator && 'indicator',
          disableSelection && 'disableSelection',
          disableInteraction && 'disableInteraction'
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={'TreeItem'} ref={ref} style={style}>
          {!disabled &&<Handle {...handleProps} />}
          {onCollapse && (
            <Action
              onClick={onCollapse}
              className={classNames(
                'Collapse',
                collapsed && 'collapsed'
              )}
            >
              {collapseIcon}
            </Action>
          )}
          <Typography className={'Text'}>{value}</Typography>
          {!clone && !disabled && onAdd && <Add onClick={onAdd}/>}
          {!clone && !disabled && onEdit && <Edit onClick={onEdit}/>}
          {!clone && !disabled && onRemove && <Remove onClick={onRemove}/>}
          {clone && childCount && childCount > 1 ? (
            <span className={'Count'}>{childCount}</span>
          ) : null}
        </div>
      </Wrapper>
    );
  }
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path
      d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z"/>
  </svg>
);
