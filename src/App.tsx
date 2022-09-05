import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import './App.css';
import Grid from './components/Grid';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    :before {
      content: '⊙';
      margin-right: 1.5rem;
      color: #646cff;
      text-shadow: 0 1px 10px #646cff;
    }
  }
`;
const Content = styled(motion.div)`
  border-radius: 8px;
  padding: 2rem 3rem;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

function App() {
  return (
    <>
      <Grid />
      <div className="App" style={{ position: 'relative', zIndex: 10 }}>
        <Header>
          <h1>Pointer Animation</h1>
          <a href="https://github.com/arielbk/pointer-animation">GitHub</a>
        </Header>
        <Content
          style={{ scale: 1, background: '#333' }}
          whileHover={{ background: '#444' }}
          whileTap={{ scale: 1.02 }}
        >
          Dummy content box to illustrate the pointer background animation
          effect.
        </Content>
      </div>
    </>
  );
}

export default App;
