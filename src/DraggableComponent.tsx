import React from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";
import type { Box } from "./types";

const Wrapper = styled.div<{ selected?: boolean; disable: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  padding: 2px;
  background: rgba(200, 200, 200, 0.5);
  ${(props) => props.selected && `border:1px solid red`}
`;

type DraggableBoxProps = Box & { isMultiSelecting: boolean };

export const DraggableBox: React.FC<DraggableBoxProps> = ({
  id,
  selected,
  isMultiSelecting = false,
}) => {
  const [{ canDrag }, drag] = useDrag(
    () => ({
      type: "boxes",
      item: [id],
      collect: (monitor) => ({
        canDrag: isMultiSelecting === false,
      }),
    }),
    [isMultiSelecting]
  );

  return (
    <Wrapper
      ref={canDrag ? drag : null}
      className="box"
      id={id}
      selected={selected}
      disable={isMultiSelecting}
    ></Wrapper>
  );
};
