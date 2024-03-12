import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Home = () => <h2>Home</h2>;

const DynamicPage = ({ pageId }) => <h2>Dynamic Page {pageId}</h2>;

const App = () => {
  const [dynamicRoutes, setDynamicRoutes] = useState([]);

  const addRoute = () => {
    const newId = dynamicRoutes.length + 1;
    setDynamicRoutes((prevRoutes) => [
      ...prevRoutes,
      { path: `/dynamic/${newId}`, component: () => <DynamicPage pageId={newId} /> },
    ]);
  };

  const removeRoute = () => {
    if (dynamicRoutes.length > 0) {
      setDynamicRoutes((prevRoutes) => prevRoutes.slice(0, -1));
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {dynamicRoutes.map((route) => (
              <li key={route.path}>
                <Link to={route.path}>Dynamic Page {route.path.split('/').pop()}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          {dynamicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component()} />
          ))}
        </Routes>

        <div>
          <button onClick={addRoute}>Add Dynamic Page</button>
          <button onClick={removeRoute}>Remove Dynamic Page</button>
        </div>
      </div>
    </Router>
  );
};

export default App;
