const BoardControls = ({ onFlip, onSettings }) => {
  return (
    <>
      <button
        aria-label="Flip board"
        className="demo-button"
        onClick={onFlip}
        title="Flip board"
        type="button"
      >
        <i aria-hidden="true" className="fas fa-sync-alt" />
      </button>
      <button
        aria-label="Board settings"
        className="demo-button"
        onClick={onSettings}
        title="Board settings"
        type="button"
      >
        <i aria-hidden="true" className="fas fa-cog" />
      </button>
    </>
  );
};

export default BoardControls;
