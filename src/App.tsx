import { useState, useEffect } from 'react';
import Start from './assets/start.svg';
import Pause from './assets/pause.svg';

export default function App() {
  const [mode, setMode] = useState<'realtime' | 'stopwatch'>('realtime');
  const [time, setTime] = useState('00:00:00');
  const [passed, setPassed] = useState('');
  const [started, setStarted] = useState(0);

  useEffect(() => {
    const to = setInterval(() => {
      const rn = new Date();
      setTime(new Date(rn.getTime() - (rn.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[1].split('.')[0])
    }, 1000)
    return () => clearInterval(to);
  }, [])

  useEffect(() => {
    if(mode === 'realtime') {
      setPassed('')
      setStarted(0)
    }
  }, [mode])

  useEffect(() => {
    if(started === 0) return

    const temp = setInterval(() => {
      setPassed(parseFrom(new Date().getTime() - started))
    }, 1000)


    return () => clearInterval(temp);
  }, [started])
  
  function parseFrom(ms: number): string {
    const prefix = (temp: number): string => temp < 10 ? `0${temp}`: `${temp}`
    const temp = new Date(ms);

    return `${prefix(temp.getHours() - 1)}:${prefix(temp.getMinutes())}:${prefix(temp.getSeconds())}`
  }

  const handleButton = (): void => {
    if(started > 0) { setStarted(0); setPassed('') }
    else setStarted(new Date().getTime())
  }

  return <div className='w-screen h-screen relative flex flex-col justify-center items-center'>
    <div className='w-44 h-10 border-2 bg-slate-300'>
      <button style={mode == 'realtime' ? { backgroundColor: 'rgba(0, 0, 0, .2)' }: {}} className='w-1/2 h-full' onClick={() => setMode('realtime')}>Real time</button>
      <button style={mode != 'realtime' ? { backgroundColor: 'rgba(0, 0, 0, .2)' }: {}} className='w-1/2 h-full border-l-2' onClick={() => setMode('stopwatch')}>Stopwatch</button>
    </div>
    
    {mode == 'realtime' && <span className='text-[7rem] font-bold'>{time}</span>}
    
    {mode == 'stopwatch' && <div className='w-72 h-44 flex justify-center items-center'>
      <button onClick={handleButton}><img src={started > 0 ? Pause: Start} alt="Start" className='w-10' /></button>
      <span>{passed}</span>
    </div>}
  </div>
}