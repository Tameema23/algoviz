export function linearSearch(arr, target) {
  const steps = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], current: i, found: false, target, message: `Checking index ${i}: arr[${i}] = ${arr[i]}` });
    if (arr[i] === target) {
      steps.push({ array: [...arr], current: i, found: true, target, message: `Found ${target} at index ${i}!` });
      return steps;
    }
  }
  steps.push({ array: [...arr], current: -1, found: false, target, message: `${target} not found` });
  return steps;
}

export function binarySearch(arr, target) {
  const steps = [];
  const sorted = [...arr].sort((a, b) => a - b);
  let low = 0, high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ array: sorted, low, high, mid, found: false, target, message: `low=${low}, high=${high}, mid=${mid}, arr[mid]=${sorted[mid]}` });
    if (sorted[mid] === target) {
      steps.push({ array: sorted, low, high, mid, found: true, target, message: `Found ${target} at index ${mid}!` });
      return steps;
    } else if (sorted[mid] < target) {
      steps.push({ array: sorted, low: mid + 1, high, mid, found: false, target, message: `${sorted[mid]} < ${target}, search right half` });
      low = mid + 1;
    } else {
      steps.push({ array: sorted, low, high: mid - 1, mid, found: false, target, message: `${sorted[mid]} > ${target}, search left half` });
      high = mid - 1;
    }
  }
  steps.push({ array: sorted, low, high, mid: -1, found: false, target, message: `${target} not found` });
  return steps;
}

export const SEARCHING_ALGORITHMS = {
  linear: { name: 'Linear Search', fn: linearSearch, time: 'O(n)', space: 'O(1)', description: 'Checks each element one by one. Works on unsorted arrays.', pseudocode: ['for i = 0 to n:', '  if arr[i] == target:', '    return i', 'return -1'] },
  binary: { name: 'Binary Search', fn: binarySearch, time: 'O(log n)', space: 'O(1)', description: 'Repeatedly halves the search space. Requires sorted array.', pseudocode: ['low, high = 0, n-1', 'while low <= high:', '  mid = (low+high) / 2', '  if arr[mid] == target:', '    return mid', '  elif arr[mid] < target:', '    low = mid + 1', '  else: high = mid - 1'] },
};
