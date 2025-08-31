import classnames from 'merge-class-names';
import { Button } from '../../components';
import { useDrillContext } from './DrillContext';

const DrillMode = () => {
  const { mode, setMode } = useDrillContext();

  return (
    <div className="hint-mode flex items-center w-full gap-2">
      <div className="flex flex-wrap gap-1 items-center justify-center rounded bg-tertiary">
        <Button
          className={classnames(
            'button mini tertiary flex items-center px-2 py-2 rounded-l',
            mode === 'arrows' && 'bg-accent text-white'
          )}
          onClick={() => setMode('arrows')}
          title="Arrow hints"
        >
          <i className="w-4 fas fa-arrow-up" />
        </Button>
        <Button
          className={classnames(
            'button mini tertiary flex items-center px-2 py-2',
            mode === 'squares' && 'bg-accent text-white'
          )}
          onClick={() => setMode('squares')}
          title="Square hints"
        >
          <i className="w-4 fas fa-square" />
        </Button>
        <Button
          className={classnames(
            'button mini tertiary flex items-center px-2 py-2 rounded-r',
            mode === 'nohint' && 'bg-accent text-white'
          )}
          onClick={() => setMode('nohint')}
          title="No hints"
        >
          <i className="w-4 fas fa-eye-slash" />
        </Button>
      </div>
    </div>
  );
};

export default DrillMode;
