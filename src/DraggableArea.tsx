import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid #000;
  display: flex;
  flex-wrap: warp;
`;

export const DraggableArea = () => {
  return <Wrapper />;
};
