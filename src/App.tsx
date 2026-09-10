import { lazy, Suspense } from "react";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <LoadingProvider>
      <ErrorBoundary fallback={<div style={{ background: "#0b080c", minHeight: "100vh" }} />}>
        <Suspense fallback={<div style={{ background: "#0b080c", minHeight: "100vh" }} />}>
          <MainContainer>
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <CharacterModel />
              </Suspense>
            </ErrorBoundary>
          </MainContainer>
        </Suspense>
      </ErrorBoundary>
    </LoadingProvider>
  );
};

export default App;
