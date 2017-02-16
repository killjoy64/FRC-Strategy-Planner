export class TeamSearcher {

  private count: number;

  constructor() {
    this.count = 0;
  }

  /* Function that performs a recursive binary search. */
  public search(teams, goal, low, high) {
    let mid = Math.round((high - low) / 2);

    this.count++;

    let goal_number = parseInt(goal);
    let high_number = parseInt(teams[high].team_number);
    let low_number = parseInt(teams[low].team_number);
    let mid_number = parseInt(teams[mid].team_number);

    console.log(low + ":" + low_number + " | " + mid + ":" + mid_number +  " | " + high + ":" + high_number + " | " + "goal:" + goal_number);

    if (high_number === goal_number) {
      console.log(this.count + " iterations");
      this.count = 0;
      return teams[high];
    }

    if (low_number === goal_number) {
      console.log(this.count + " iterations");
      this.count = 0;
      return teams[low];
    }

    if (mid_number === goal_number) {
      console.log(this.count + " iterations");
      this.count = 0;
      return teams[mid];
    } else if (mid_number < goal_number) {
      // our number is in upper half of array
      return this.search(teams, goal_number, mid+1, high);
    } else if (mid_number > goal_number) {
      // our number is in lower half of array
      return this.search(teams, goal_number, low, mid-1);
    } else {
      console.log ("did not find");
      return -1;
    }

  }

}
