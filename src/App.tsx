import { useState, useEffect } from "react";

import { bubbleSort, type SortStep} from "./sorting/bubbleSort";
import { selectionSort } from "./sorting/selectionSort";
import { insertionSort } from "./sorting/insertionSort";
import { mergeSort } from "./sorting/mergeSort";
import { quickSort } from "./sorting/quickSort";

const initialArray=[5, 2, 8, 1, 4]

function App(){
  const [algorithm, setAlgorithm]=useState('bubble')
  const [steps,setSteps]=useState<SortStep[]>(()=>bubbleSort(initialArray),)
  const [stepIndex, setStepIndex]=useState(-1)
  const [isPlaying, setIsPlaying]=useState(false)
  const [speed,setSpeed]=useState(500)

  const currentArray=stepIndex===-1?initialArray:steps[stepIndex].array
  
  const comparing=stepIndex===-1?[]:steps[stepIndex].comparing

  function handleAlgorithmChange(
    event:React.ChangeEvent<HTMLSelectElement>,
  ){
    const selectedAlgorithm=event.target.value

    setAlgorithm(selectedAlgorithm)

    const newSteps=
      selectedAlgorithm==='bubble'
        ?bubbleSort(initialArray)
        :selectedAlgorithm==='selection'
          ?selectionSort(initialArray)
          :selectedAlgorithm==='insertion'
            ?insertionSort(initialArray)
            :selectedAlgorithm==='merge'
              ?mergeSort(initialArray)
              :quickSort(initialArray)

    setSteps(newSteps)
    setStepIndex(-1)
    setIsPlaying(false)
  }

  function handleNext(){
    if(stepIndex<steps.length-1){
      setStepIndex((current)=>current+1)
    }
  }

  function handlePrevious(){
    if(stepIndex>=0){
      setStepIndex((current)=>current-1)
    }
  }

  function handleReset(){
    setIsPlaying(false)
    setStepIndex(-1)
  }

  useEffect(()=>{
    if(!isPlaying){
      return
    }
    if(stepIndex>=steps.length-1){
      setIsPlaying(false)
      return
    }
    const timer=setTimeout(()=>{
      setStepIndex((current)=>current+1)
    },speed)
    return ()=>clearTimeout(timer)
  },[isPlaying, stepIndex, steps.length, speed])
  
  return(
    <div className="app">
      <header className="header">
        <h1>AlgoLab</h1>
        <p>Sorting Visualizer</p>
      </header>
      <main className="main">
        <div className="algorithm-select">
          <label htmlFor="algorithm">Algorithm: </label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={handleAlgorithmChange}
            disabled={isPlaying}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>
        <div className="visualizer">
          {currentArray.map((value,index)=>{
            const isComparing=comparing.includes(index)
            return(
              <div className="bar-container" key={index}>
                <div
                  className={`bar ${isComparing?'comparing':''}`}
                  style={{height:`${value*30}px`}}
                >
                  {value}
                </div>
              </div>
            )
          })}
        </div>
        <div className="controls">
          <button 
            onClick={handlePrevious}
            disabled={stepIndex===-1||isPlaying}
          >
            Previous Step
          </button>
          <button
            onClick={()=>setIsPlaying((current)=>!current)}
            disabled={stepIndex===steps.length-1}
          >
            {isPlaying?'Pause':'Play'}
          </button>
          <button 
            onClick={handleNext}
            disabled={stepIndex===steps.length-1||isPlaying}
          >
            Next Step
          </button>
          <button 
            onClick={handleReset}
            disabled={isPlaying}
          >
            Reset
          </button>
          <label>
            Speed:{' '}
            <select
              value={speed}
              onChange={(event)=>setSpeed(Number(event.target.value))}
              disabled={isPlaying}
            >
              <option value={1000}>Slow</option>
              <option value={500}>Normal</option>
              <option value={200}>Fast</option>
            </select>
          </label>
        </div>
        <p className="step-info">
          Step: {stepIndex+1}/{steps.length}
        </p>
      </main>
    </div>
  )
}

export default App