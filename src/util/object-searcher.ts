export class TeamSearcher {

  private count: number;

  constructor() {
    this.count = 0;
  }

  /* Function that performs a recursive binary search. */
  public search(teams, goal, index) {

    this.count++;

    let team_number = parseInt(goal);

    if (teams[index].team_number == team_number) {
      console.log(this.count + " iterations");
      this.count = 0;
      return teams[index];
    } else if (teams[index].team_number > team_number) {
      // team_number < mid, so our number is in the lower half
      this.search(teams, team_number, Math.ceil(index - (index / 2)));
    } else if (teams[index].team_number < team_number) {
      // team_number > mid, so our number is in the upper half
      this.search(teams, team_number, Math.ceil(index + (index / 2)));
    }

  }

}
