import React from 'react';

const Loader = () => {
  const styles = {
    page: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed', // Fix the loader to the screen
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with slight transparency
      zIndex: 9999, // Ensure it's on top of all other elements
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    ringBase: {
      width: '190px',
      height: '190px',
      border: '1px solid transparent',
      borderRadius: '50%',
      position: 'absolute',
    },
    text: {
      color: 'black',
      position: 'absolute',
      bottom: '-30px',
    },
  };

  const ringColors = [
    'rgb(255, 141, 249)',
    'rgb(255,65,106)',
    'rgb(0,255,255)',
    'rgb(252, 183, 55)',
  ];

  const ringAnimations = ['rotate1', 'rotate2', 'rotate3', 'rotate4'];

  const rings = ringColors.map((color, i) =>
    React.createElement('div', {
      key: i,
      style: {
        ...styles.ringBase,
        borderBottom: `8px solid ${color}`,
        animation: `${ringAnimations[i]} 2s linear infinite`,
      },
    })
  );

  const styleTag = React.createElement('style', null, `
    @keyframes rotate1 {
      from { transform: rotateX(50deg) rotateZ(110deg); }
      to { transform: rotateX(50deg) rotateZ(470deg); }
    }
    @keyframes rotate2 {
      from { transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg); }
      to { transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg); }
    }
    @keyframes rotate3 {
      from { transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg); }
      to { transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg); }
    }
    @keyframes rotate4 {
      from { transform: rotateX(70deg) rotateZ(270deg); }
      to { transform: rotateX(70deg) rotateZ(630deg); }
    }
  `);

  return React.createElement(
    React.Fragment,
    null,
    styleTag,
    React.createElement(
      'div',
      { style: styles.page },
      React.createElement(
        'div',
        { style: styles.container },
        ...rings,
        React.createElement('div', { style: styles.text }, 'Loading')
      )
    )
  );
};

export default Loader;
