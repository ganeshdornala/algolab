import type { SortStep } from "./bubbleSort";

export function insertionSort(input:number[]):SortStep[]{
    const array=[...input]
    const steps:SortStep[]=[]
    
    for(let i=1;i<array.length;i++){
        let j=i

        while(j>0){
            steps.push({
                array:[...array],
                comparing:[j-1,j],
                operation:'compare',
            })

            if(array[j-1]<=array[j]){
                break
            }

            ;[array[j-1],array[j]]=[array[j],array[j-1]]

            steps.push({
                array:[...array],
                comparing:[j-1,j],
                operation:'swap',
            })

            j--
        }
    }

    return steps
}