// Each algorithm returns an array of steps
// Each step: { array, comparing: [i,j], swapping: [i,j], sorted: [i,...], pivot: i }

export function bubbleSort(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: null, sorted: [...sorted] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.unshift(a.length - 1 - i);
  }
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export function selectionSort(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = [];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], swapping: null, sorted: [...sorted], pivot: i });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: null, swapping: [i, minIdx], sorted: [...sorted] });
    }
    sorted.push(i);
  }
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export function insertionSort(arr) {
  const steps = [];
  const a = [...arr];
  const sorted = [0];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      steps.push({ array: [...a], comparing: [j - 1, j], swapping: null, sorted: [...sorted] });
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      steps.push({ array: [...a], comparing: null, swapping: [j, j - 1], sorted: [...sorted] });
      j--;
    }
    sorted.push(i);
  }
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export function mergeSort(arr) {
  const steps = [];
  const a = [...arr];

  function merge(a, l, m, r) {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push({ array: [...a], comparing: [l + i, m + 1 + j], swapping: null, sorted: [] });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; }
      steps.push({ array: [...a], comparing: null, swapping: null, sorted: [] });
    }
    while (i < left.length) { a[k++] = left[i++]; steps.push({ array: [...a], comparing: null, swapping: null, sorted: [] }); }
    while (j < right.length) { a[k++] = right[j++]; steps.push({ array: [...a], comparing: null, swapping: null, sorted: [] }); }
  }

  function sort(a, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    sort(a, l, m);
    sort(a, m + 1, r);
    merge(a, l, m, r);
  }

  sort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export function quickSort(arr) {
  const steps = [];
  const a = [...arr];

  function partition(a, low, high) {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: null, sorted: [], pivot: high });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ array: [...a], comparing: null, swapping: [i, j], sorted: [], pivot: high });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], comparing: null, swapping: [i + 1, high], sorted: [], pivot: i + 1 });
    return i + 1;
  }

  function sort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high);
      sort(a, low, pi - 1);
      sort(a, pi + 1, high);
    }
  }

  sort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export function heapSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;

  function heapify(a, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    steps.push({ array: [...a], comparing: [i, l < n ? l : i], swapping: null, sorted: [] });
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ array: [...a], comparing: null, swapping: [i, largest], sorted: [] });
      heapify(a, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
  const sorted = [];
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    steps.push({ array: [...a], comparing: null, swapping: [0, i], sorted: [...sorted] });
    heapify(a, i, 0);
  }
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i) });
  return steps;
}

export const SORTING_ALGORITHMS = {
  bubble: { name: 'Bubble Sort', fn: bubbleSort, time: 'O(n²)', space: 'O(1)', description: 'Repeatedly swaps adjacent elements if they are in the wrong order. Simple but inefficient for large datasets.', pseudocode: ['for i = 0 to n-1', '  for j = 0 to n-i-2', '    if arr[j] > arr[j+1]', '      swap(arr[j], arr[j+1])'] },
  selection: { name: 'Selection Sort', fn: selectionSort, time: 'O(n²)', space: 'O(1)', description: 'Finds the minimum element and places it at the beginning. Minimizes swaps.', pseudocode: ['for i = 0 to n-1', '  minIdx = i', '  for j = i+1 to n', '    if arr[j] < arr[minIdx]', '      minIdx = j', '  swap(arr[i], arr[minIdx])'] },
  insertion: { name: 'Insertion Sort', fn: insertionSort, time: 'O(n²)', space: 'O(1)', description: 'Builds sorted array one element at a time. Efficient for small or nearly sorted data.', pseudocode: ['for i = 1 to n', '  key = arr[i]', '  j = i - 1', '  while j >= 0 and arr[j] > key', '    arr[j+1] = arr[j]', '    j--', '  arr[j+1] = key'] },
  merge: { name: 'Merge Sort', fn: mergeSort, time: 'O(n log n)', space: 'O(n)', description: 'Divide and conquer. Splits array in half, sorts each half, then merges.', pseudocode: ['mergeSort(arr, l, r)', '  if l >= r: return', '  m = (l+r) / 2', '  mergeSort(arr, l, m)', '  mergeSort(arr, m+1, r)', '  merge(arr, l, m, r)'] },
  quick: { name: 'Quick Sort', fn: quickSort, time: 'O(n log n) avg', space: 'O(log n)', description: 'Picks a pivot and partitions array around it. Fast in practice.', pseudocode: ['quickSort(arr, low, high)', '  if low < high', '    pi = partition(arr, low, high)', '    quickSort(arr, low, pi-1)', '    quickSort(arr, pi+1, high)'] },
  heap: { name: 'Heap Sort', fn: heapSort, time: 'O(n log n)', space: 'O(1)', description: 'Builds a max heap, then repeatedly extracts the maximum element.', pseudocode: ['buildMaxHeap(arr)', 'for i = n-1 to 1', '  swap(arr[0], arr[i])', '  heapify(arr, i, 0)'] },
};
