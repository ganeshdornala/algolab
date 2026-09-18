import type { SortStep } from "./bubbleSort"

export function selectionSort(input: number[]):SortStep[]{
    const array=[...input]
    const steps: SortStep[]=[]

    for(let i=0;i<array.length-1;i++){
        let minIndex=i

        for(let j=i+1;j<array.length;j++){
            steps.push({
                array:[...array],
                comparing:[minIndex,j],
                operation:'compare',
            })

            if(array[j]<array[minIndex]){
                minIndex=j
            }
        }

        if(minIndex!==i){
            ;[array[i], array[minIndex]]=[array[minIndex], array[i]]
            
            steps.push({
                array:[...array],
                comparing:[i, minIndex],
                operation:'swap',
            })
        }
    }

    return steps
}