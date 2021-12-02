import React, { useEffect, useState } from 'react';
import getCastles from '../utils/get-castles';

const FenOptions = ({ onChange }) => {
  const [side, setSide] = useState('w');
  const [castles, setCastles] = useState('-');

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange([side, castles].join(' '));
    }
  }, [side, castles]);

  const changeSide = (e) => {
    const { value } = e.target;
    setSide(value);
  };
  const changeCastle = (e) => {
    const { value } = e.target;
    setCastles(getCastles(castles, value));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <div>
          <input
            defaultChecked
            className="mx-1"
            type="radio"
            id="white-radio"
            name="side-to-move"
            value="w"
            onChange={changeSide}
          />
          <label htmlFor="white-radio">White to move</label>
        </div>
        <div>
          <input
            className="mx-1"
            type="radio"
            id="black-radio"
            name="side-to-move"
            value="b"
            onChange={changeSide}
          />
          <label htmlFor="black-radio">Black to move</label>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full gap-4">
          <div>
            <span>White can</span>
          </div>
          <div>
            <input
              className="mx-1"
              type="checkbox"
              id="white-short-castle"
              value="K"
              onChange={changeCastle}
            />
            <label htmlFor="white-short-castle">O-O</label>
          </div>
          <div>
            <input
              className="mx-1"
              type="checkbox"
              id="white-long-castle"
              value="Q"
              onChange={changeCastle}
            />
            <label htmlFor="white-long-castle">O-O-O</label>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div>
            <span>Black can</span>
          </div>
          <div>
            <input
              className="mx-1"
              type="checkbox"
              id="black-short-castle"
              value="k"
              onChange={changeCastle}
            />
            <label htmlFor="black-short-castle">O-O</label>
          </div>
          <div>
            <input
              className="mx-1"
              type="checkbox"
              id="black-long-castle"
              value="q"
              onChange={changeCastle}
            />
            <label htmlFor="black-long-castle">O-O-O</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FenOptions;
