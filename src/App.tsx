import { ControlCenter } from './components/ControlCenter';
import { DetachedTerminalView } from './components/ssh/DetachedTerminalView';
import { PopupView } from './components/PopupView';

function App() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  const view = params.get('view');

  if (sessionId) {
    return (
      <DetachedTerminalView
        sessionId={sessionId}
        alias={params.get('alias') ?? undefined}
        user={params.get('user') ?? undefined}
        hostname={params.get('hostname') ?? undefined}
        port={params.get('port') ? Number(params.get('port')) : undefined}
      />
    );
  }

  if (view === 'popup') {
    return <PopupView />;
  }

  return <ControlCenter />;
}

export default App;
