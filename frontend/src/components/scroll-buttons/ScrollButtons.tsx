// src/components/scroll-buttons/ScrollButtons.tsx
type ScrollButtonsProps = {
  onUp: () => void;
  onDown: () => void;
};

function ScrollButtons({ onUp, onDown }: ScrollButtonsProps) {
  return (
    <div className="scroll">
      <button className="btn-up" onClick={onUp}>
        <i className="fa-solid fa-chevron-up"></i>
      </button>
      <button className="btn-down" onClick={onDown}>
        <i className="fa-solid fa-chevron-down"></i>
      </button>
    </div>
  );
}

export default ScrollButtons;