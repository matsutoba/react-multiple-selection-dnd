import React from "react";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  padding: 2px;
  background: rgba(200, 200, 200, 0.5);
  border: 1px solid #000;
`;

export const CustomDragLayer: React.FC = () => {
  const { item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  return (
    <Wrapper
      style={{
        transform: `translate(${currentOffset?.x || 0}px, ${
          currentOffset?.y || 0
        }px)`,
      }}
    >
      {item?.map((box) => {
        return <div key={box.id}>{box.id}</div>;
      })}
    </Wrapper>
  );
};
