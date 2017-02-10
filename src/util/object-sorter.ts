/**
 * Created by Kyle Flynn on 2/9/2017.
 */

export class AwardSorter {

  public sort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.sort(items, left, partitionIndex - 1);
      this.sort(items, partitionIndex + 1, right);
    }

    return items;
  }

  private partition(items, pivot, left, right) {
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

  private swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

  private shouldSwap(award1, award2) {
    let eventCompare = this.compare(award1.even_week, award2.event_comp_level);
    if (eventCompare == -1) {
      return -1;
    }
    if (eventCompare == 1) {
      return 1;
    }
    if (eventCompare == 0) {
      // They are equal
      let d1 = award1.event_start_date.split("-");
      let d2 = award2.event_start_date.split("-");
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

  private compare(event_1_week, event_2_week) {
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

export class MatchSorter {

  constructor() {}

  public sort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.sort(items, left, partitionIndex - 1);
      this.sort(items, partitionIndex + 1, right);
    }

    return items;
  }

  private partition(items, pivot, left, right) {
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

  private swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

  private shouldSwap(match1, match2) {
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

  private compare(match_type_1, match_type_2) {
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

  public sort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.sort(items, left, partitionIndex - 1);
      this.sort(items, partitionIndex + 1, right);
    }

    return items;
  }

  private partition(items, pivot, left, right) {
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

  private swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

}

export class EventSorter {

  public sort(items, left, right) {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.sort(items, left, partitionIndex - 1);
      this.sort(items, partitionIndex + 1, right);
    }

    return items;
  }

  private partition(items, pivot, left, right) {
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

  private swap(items, index1, index2) {
    let temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

  private shouldSwap(event1, event2) {
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
