import React, { useState } from 'react';
import { Popover, Position, Icon } from 'evergreen-ui';
import styled, { css } from 'styled-components';
import MenuContent from './MenuContent';

const MenuWrapper = styled.div`
  position: absolute;
  left: 30px;
  bottom: 20px;
`;

const MenuButton = styled(Icon)`
  opacity: 0.6;
  cursor: pointer;
  transition: all 300ms ease;
  transform-origin: 50% 50%;

  &:hover {
    opacity: 1;
  }

  ${(props) =>
    props.isopen &&
    css`
      opacity: 1;
      transform: rotate(45deg) scale(1.1);
    `}
`;

const ConfigMenu = (props) => {
  const [isopen, setIsopen] = useState(false);

  const handleOnOpen = () => {
    setIsopen(true);
  };

  const handleOnClose = () => {
    setIsopen(false);
  };

  return (
    <MenuWrapper>
      <Popover
        position={Position.BOTTOM_LEFT}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
        content={<MenuContent {...props} />}
      >
        <MenuButton
          id="menu-button"
          icon="cog"
          size={20}
          color="white"
          isopen={isopen.toString()}
        />
      </Popover>
    </MenuWrapper>
  );
};

export default ConfigMenu;
