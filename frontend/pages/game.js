// pages/game.js
import RuffleLoader from '../components/RuffleLoader';

export default function GamePage() {
  return (
    <div>
      <RuffleLoader />
      <embed
        src="/games/game1.swf"
        width="800"
        height="600"
      />
    </div>
  );
}