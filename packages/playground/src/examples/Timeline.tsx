import React, {
  forwardRef,
  Fragment,
  useRef,
  useImperativeHandle,
  ReactElement,
  ReactHTMLElement,
  useCallback,
  useEffect,
  MutableRefObject,
} from 'react';
import styled from 'styled-components';
import { Tween, Timeline, SplitWords, SplitChars, Controls, PlayState } from 'react-gsap';

const TimelineStyled = styled.div``;

const TimelinePlayState = () => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  return (
    <>
      <Timeline
        target={<div style={{ width: '100px', height: '100px', background: '#ccc' }} />}
        playState={playing ? PlayState.play : PlayState.pause}
        totalProgress={progress}
        paused={false}
      >
        <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} duration={2} />
        <Tween to={{ x: '200px' }} />
        <Tween to={{ rotation: 180 }} position="+=1" />
      </Timeline>
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={event => setProgress(parseFloat(event.target.value))}
        />
      </div>
    </>
  );
};

const TimelineComponent = () => (
  <TimelineStyled>
    Play with these example on{' '}
    <a href="https://stackblitz.com/edit/react-ambemn" target="_blank" rel="noopener noreferrer">
      StackBlitz.io
    </a>
    <div className="section">Nested Timeline</div>
    <Controls>
      <Timeline
        wrapper={
          <div
            style={{
              width: '600px',
              height: '200px',
              backgroundColor: '#f0f0f0',
              position: 'relative',
              overflow: 'hidden',
            }}
          />
        }
        target={
          <Fragment>
            <SplitWords
              wrapper={
                <div style={{ position: 'relative', fontSize: '50px', display: 'inline-block' }} />
              }
            >
              This is a Timeline
            </SplitWords>
          </Fragment>
        }
        repeat={0}
      >
        <Tween
          from={{ x: '-500px' }}
          to={{ x: '80px' }}
          duration={0.7}
          ease="Elastic.easeOut"
          delay={0.5}
        />
        <Tween to={{ y: '55px' }} stagger={0.2} duration={0.1} ease="Back.easeOut" position="+=0" />
        <Tween
          to={{ x: '700px' }}
          stagger={0.2}
          duration={0.7}
          ease="Back.easeOut"
          position="+=1"
        />
        <Timeline
          wrapper={<div style={{ position: 'relative', left: '90px' }} />}
          target={
            <Fragment>
              <SplitChars wrapper={<div style={{ fontSize: '80px', display: 'inline-block' }} />}>
                AIIIIGHHT
              </SplitChars>
            </Fragment>
          }
          labels={[
            {
              label: 'sec4',
              position: 4,
            },
            {
              label: 'sec6',
              position: 6,
            },
          ]}
        >
          <Tween from={{ opacity: 0 }} to={{ opacity: 1 }} stagger={0.1} position="+=0" />
          <Tween to={{ scale: 20, rotation: -180 }} position="+=1" />
          <Tween to={{ opacity: 0 }} position="sec4" />
          <Tween to={{ scale: 1, rotation: 0, opacity: 1 }} position="sec6" />
        </Timeline>
      </Timeline>
    </Controls>
    <TimelinePlayState />
  </TimelineStyled>
);

const TargetWithNames = forwardRef((props, ref: any) => {
  const div1 = useRef(null);
  const div2 = useRef<MutableRefObject<any>[]>([]);
  const div3 = useRef(null);
  useImperativeHandle(ref, () => ({
    div1,
    div2,
    div3,
  }));
  return (
    <div>
      <div ref={div1}>first</div>
      <SplitChars
        ref={(charRef: MutableRefObject<any>) => div2.current.push(charRef)}
        wrapper={<span style={{ display: 'inline-block' }} />}
      >
        second
      </SplitChars>
      <div ref={div3}>third</div>
    </div>
  );
});

const TimelineTargets = () => {
  return (
    <Timeline target={<TargetWithNames />}>
      <Tween to={{ x: '200px' }} target="div3" position="0" />
      <Tween to={{ x: '200px' }} target="div1" position="0.5" />
      <Tween to={{ x: '200px' }} target="div2" position="1" stagger={0.1} />
    </Timeline>
  );
};

//export default TimelineTargets;

const Component = forwardRef(({ children }, ref?) => {
  const div1 = useRef(null);
  const div2 = useRef(null);
  useImperativeHandle(ref, () => ({
    div1,
    div2,
    test: () => {
      console.log('run test');
    },
  }));
  return (
    <div>
      <div ref={div1}>
        <span>{children}</span>
      </div>
      <div ref={div2}>Div 2</div>
    </div>
  );
});

const AnimatedComponent = ({ children, ...props }) => {
  const component = useRef(null);

  useEffect(() => {
    console.log('component', component);
  }, []);

  return (
    <Timeline
      target={
        <Component ref={component} {...props}>
          {children}
        </Component>
      }
    >
      <Tween target="div1" from={{ opacity: 0 }} to={{ opacity: 1 }} duration={1} />
      <Tween target="div2" from={{ opacity: 0 }} to={{ opacity: 1 }} duration={1} />
    </Timeline>
  );
};

// const Out = () => {
//   return (
//     <>
//       <Component>Not animated</Component>
//       <AnimatedComponent>Animated</AnimatedComponent>
//     </>
//   );
// };

const Out = () => {
  const divRef1 = useCallback(ref => {
    if (ref !== null) {
      // Ref never updates
      console.log(ref);
    }
  }, []);

  const divRef2 = useRef(null);

  useEffect(() => {
    // Ref never updates
    console.log(divRef2.current);
  }, []);

  return (
    <div className="App">
      <Timeline target={<TargetWithNames />}>
        <Tween from={{ x: -100 }} to={{ x: 100 }}>
          <div ref={divRef1} style={{ width: 200, height: 200, background: 'rebeccapurple' }} />
        </Tween>

        <Tween from={{ x: -100 }} to={{ x: 100 }}>
          <div ref={divRef2} style={{ width: 200, height: 200, background: 'fuchsia' }} />
        </Tween>

        <Tween to={{ x: '200px' }} target="div3" position="0" />
        <Tween to={{ x: '200px' }} target="div1" position="0.5" />
        <Tween to={{ x: '200px' }} target="div2" position="1" stagger={0.1} />
      </Timeline>
    </div>
  );
};

export default Out;
