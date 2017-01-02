export class MatchSorter {

  constructor() {}

  quicksort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.quicksort(items, left, partitionIndex - 1);
      this.quicksort(items, partitionIndex + 1, right);
    }

    return items;
  }

  quickSort(items, left, right) {
    return new Promise(function(resolve) {
      let pivot, partitionIndex;

      if (left < right) {
        pivot = right;
        partitionIndex = this.partition(items, pivot, left, right);

        this.quicksort(items, left, partitionIndex - 1);
        this.quicksort(items, partitionIndex + 1, right);
      }

      resolve(items);
    });
  }

  partition(items, pivot, left, right) {
    let pivotValue = items[pivot];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
      if (this.shouldSwap(items[i], pivotValue) == -1) {
        this.swap(items, i, partitionIndex);
        partitionIndex++;
      }
    }
    this.swap(items, right, partitionIndex);
    return partitionIndex;
  }

  swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

  shouldSwap(match1, match2) {
    let matchType = this.compare(match1.comp_level, match2.comp_level);
    if (matchType == -1) {
      // Match1 < Match2
      return -1;
    }
    if (matchType == 1) {
      // Match1 > Match2
      return 1;
    }
    if (matchType == 0) {
      // They are equal
      let set1 = parseInt(match1.set_number);
      let set2 = parseInt(match2.set_number);
      if (set1 < set2) {
        return -1;
      }
      if (set1 > set2) {
        return 1;
      }
      if (set1 == set2) {
        // Still equal
        let num1 = parseInt(match1.match_number);
        let num2 = parseInt(match2.match_number);
        if (num1 < num2) {
          return -1;
        }
        if (num1 > num2) {
          return 1;
        }
        if (num1 == num2) {
          return 0;
        }
      }
    }
  }

  compare(match_type_1, match_type_2) {
    let type1 = 0;
    let type2 = 0;

    if (match_type_1 == "qm") {
      type1 = 0;
    } else if (match_type_1 == "ef") {
      type1 = 1;
    } else if (match_type_1 == "qf") {
      type1 = 2;
    } else if (match_type_1 == "sf") {
      type1 = 3;
    } else if (match_type_1 == "f") {
      type1 = 4;
    }

    if (match_type_2 == "qm") {
      type2 = 0;
    } else if (match_type_2 == "ef") {
      type2 = 1;
    } else if (match_type_2 == "qf") {
      type2 = 2;
    } else if (match_type_2 == "sf") {
      type2 = 3;
    } else if (match_type_2 == "f") {
      type2 = 4;
    }

    if (type1 < type2) {
      return -1;
    }

    if (type1 == type2) {
      return 0;
    }

    if (type1 > type2) {
      return 1;
    }

  }

}

export class TeamSorter {

  constructor() {}

  quicksort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.quicksort(items, left, partitionIndex - 1);
      this.quicksort(items, partitionIndex + 1, right);
    }

    return items;
  }

  partition(items, pivot, left, right) {
    let pivotValue = items[pivot];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
      let team_number_1 = parseInt(items[i].team_number);
      let team_number_2 = parseInt(pivotValue.team_number);
      if (team_number_1 < team_number_2) {
        this.swap(items, i, partitionIndex);
        partitionIndex++;
      }
    }
    this.swap(items, right, partitionIndex);
    return partitionIndex;
  }

  swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

}

export class EventsSorter {

  quicksort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.quicksort(items, left, partitionIndex - 1);
      this.quicksort(items, partitionIndex + 1, right);
    }

    return items;
  }

  partition(items, pivot, left, right) {
    let pivotValue = items[pivot];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
      if (this.shouldSwap(items[i], pivotValue) == -1) {
        this.swap(items, i, partitionIndex);
        partitionIndex++;
      }
    }
    this.swap(items, right, partitionIndex);
    return partitionIndex;
  }

  swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

  shouldSwap(event1, event2) {
    let eventCompare = this.compare(event1.comp_level, event2.comp_level);
    if (eventCompare == -1) {
      // Match1 < Match2
      return -1;
    }
    if (eventCompare == 1) {
      // Match1 > Match2
      return 1;
    }
    if (eventCompare == 0) {
      // They are equal
      let d1 = event1.start_date.split("-");
      let d2 = event2.start_date.split("-");
      let date1 = new Date(parseInt(d1[0]), parseInt(d1[1]), parseInt(d1[2]));
      let date2 = new Date(parseInt(d2[0]), parseInt(d2[1]), parseInt(d2[2]));
      if (date1 < date2) {
        return -1;
      }
      if (date1 > date2) {
        return 1;
      }
      if (date1 == date2) {
        return 0;
      }
    }
  }

  compare(event_1_week, event_2_week) {
    let type1 = 0;
    let type2 = 0;

    if (event_1_week == null) {
      type1 = 10;
    } else {
      type1 = parseInt(event_1_week);
    }

    if (event_2_week == null) {
      type2 = 10;
    } else {
      type2 = parseInt(event_2_week);
    }

    if (type1 < type2) {
      return -1;
    }

    if (type1 == type2) {
      return 0;
    }

    if (type1 > type2) {
      return 1;
    }

  }

}
