import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Groups from './components/Groups';
import OneGroup from './components/OneGroup';
// import UserGroups from './components/UserGroups';
import CreateGroup from './components/CreateGroup';
// import UpdateGroup from './components/UpdateGroup';
// import DeleteGroup from './components/DeleteGroup';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/groups" component={Groups} />
          <Route exact path="/group/:groupId" component={OneGroup} />
          {/* <Route path="/groups/current" component={UserGroups} /> */}
          <Route path="/create-group" component={CreateGroup} />
          {/* <Route path="/group/new" component={CreateGroup} /> */}
          {/* <Route exact path="/groups/:groupId" component={UpdateGroup} /> */}
          {/* <Route exact path="/groups/:groupId" component={DeleteGroup} /> */}
          <Route path="/events/new" component={CreateGroup} />
        </Switch>
      )}
    </>
  );
}

export default App;
