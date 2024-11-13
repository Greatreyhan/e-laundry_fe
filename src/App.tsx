// import logo from './logo.svg';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContext from './Context';
import Cookies from 'js-cookie';
import { ConfirmationAlertEntity, MiniAlertConfirmationEntity, MiniAlertEntity } from './views/layout/alert/AlertEntity';
import { UserEntity } from './data/entity/UserEntity';
import MiniAlert from './views/layout/alert/MiniAlert';
import { AuthService } from './data/service/AuthService';
import Navbar from './views/layout/navbar/Navbar';
import ConfirmationAlert from './views/layout/alert/ConfirmationAlert';
import MiniAlertConfirmation from './views/layout/alert/MiniAlertConfirmation';
import Loading from './views/layout/alert/Loading';
import RunningText from './views/component/running-text/RunningText';
const Home = lazy(() => import('./views/page/home/Home'));
const Dashboard = lazy(() => import('./views/page/dashboard/Dashboard'));
const BatchCheckIn = lazy(() => import('./views/page/batch_check_in/BatchCheckIn'));
const LinenWashing = lazy(() => import('./views/page/linen_washing/LinenWashing'));
const LinenPacking = lazy(() => import('./views/page/linen_packing/LinenPacking'));
const BatchCheckOut = lazy(() => import('./views/page/batch_check_out/BatchCheckOut'));
const MasterUser = lazy(() => import('./views/page/master/MasterUser'));
const MasterLinen = lazy(() => import('./views/page/master/MasterLinen'));
const NotFound = lazy(() => import('./views/page/not_found/NotFound'));

function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [stateShowMiniAlert, setStateShowMiniAlert] = useState<boolean>(false);
  const [miniAlertEntity, setMiniAlertEntity] = useState<MiniAlertEntity | null>(null);
  const [miniAlertConfirmationEntity, setMiniAlertConfirmationEntity] = useState<MiniAlertConfirmationEntity | null>(null);
  const [stateShowConfirmationAlert, setStateShowConfirmationAlert] = useState<boolean>(false);
  const [stateShowMiniAlertConfirmation, setStateShowMiniAlertConfirmation] = useState<boolean>(false);
  const [stateShowLoading, setStateShowLoading] = useState<boolean>(false);
  const [confirmationAlertEntity, setConfirmationAlertEntity] = useState<ConfirmationAlertEntity | null>(null);
  const [contextUserEntity, setContextUserEntity] = useState<UserEntity | null>(null);

  //Context
  const contextAccessToken: string = Cookies.get('token') ?? '';
  const contextShowMiniAlertFunc = (val: MiniAlertEntity) => { setStateShowMiniAlert(true); setMiniAlertEntity(val); }
  const contextShowConfirmationAlertFunc = (val: ConfirmationAlertEntity) => { setStateShowConfirmationAlert(true); setConfirmationAlertEntity(val); }
  const contextShowMiniAlertConfirmationFunc = (val: MiniAlertConfirmationEntity) => { setStateShowMiniAlertConfirmation(true); setMiniAlertConfirmationEntity(val); }
  const setContextLoading = (val: boolean) => { setStateShowLoading(val); }

  // REFRESH USER DATA IF COOKIES STILL EXIST
  useEffect(() => {
    console.log('Try refresh...');
    const refresh = async () => {
      try {
        const refreshUser = await AuthService.refreshLogin();
        // console.log(refreshUser)
        if (refreshUser != null) {
          setContextUserEntity(refreshUser);
          contextShowMiniAlertFunc(new MiniAlertEntity({ title: "Login Success", messages: `Welcome Back ${refreshUser.username}`, level: 1, duration: 5000 }));
          console.log("Refresh token success")
        }
      } catch (error: any) {
        // console.log(error)
        AuthService.logout()
      }
    }
    refresh();
  }, []);

  return (
    <div className='App'>
      <AppContext.Provider
        value={{
          contextAccessToken,
          contextUserEntity,
          setContextUserEntity,
          setContextLoading,
          contextShowMiniAlertFunc,
          contextShowConfirmationAlertFunc,
          contextShowMiniAlertConfirmationFunc,
        }}>
        <BrowserRouter>
          <Navbar showNavbar={showNavbar} setShowNavbar={setShowNavbar} />
          <RunningText/>
          <Suspense fallback={
            <div >
              {/* Please Give Loading Animation :D*/}
              {/* <div>Loading...</div> */}
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/batch_check_in" element={<BatchCheckIn />} />
              <Route path="/linen_washing" element={<LinenWashing />} />
              <Route path="/linen_packing" element={<LinenPacking />} />
              <Route path="/batch_check_out" element={<BatchCheckOut />} />
              <Route path="/master/user" element={<MasterUser />} />
              <Route path="/master/linen" element={<MasterLinen />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>

        <MiniAlert
          messages={miniAlertEntity?.messages}
          duration={miniAlertEntity?.duration}
          level={miniAlertEntity?.level}
          title={miniAlertEntity?.title}
          setShowMiniAlert={setStateShowMiniAlert}
          showMiniAlert={stateShowMiniAlert}
        />

        <ConfirmationAlert
          setShowConfirmationAlert={setStateShowConfirmationAlert}
          showConfirmationAlert={stateShowConfirmationAlert}
          alertQuestion={confirmationAlertEntity?.alertQuestion}
          onClickYes={confirmationAlertEntity?.onClickYes || (() => { })}
        />

        <MiniAlertConfirmation
          setShowMiniAlertConfirmation={setStateShowMiniAlertConfirmation}
          showMiniAlertConfirmation={stateShowMiniAlertConfirmation}
          alertQuestion={miniAlertConfirmationEntity?.alertQuestion}
          onClickYes={miniAlertConfirmationEntity?.onClickYes || (() => { })}
        />

        <Loading
          showLoading={stateShowLoading}
        />
      </AppContext.Provider>
    </div >
  );
}

export default App;
