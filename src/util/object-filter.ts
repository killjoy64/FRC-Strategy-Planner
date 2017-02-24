export class EventFilter {

  public filtered_events: any;
  private events: any;

  constructor(private eventsArray: any) {
    this.events = eventsArray;
    this.filtered_events = eventsArray;
  }

  public setEvents(items) {
    this.events = items;
    this.filtered_events = items;
  }

  public filterEvents(e) {
    let value = e.target.value;

    if (value && value.trim() != '' && value != null) {
      this.filtered_events = this.events.filter((event) => {

        let query = value.toLowerCase();
        let full_name = (event.name || "null").toLowerCase();
        let short_name = (event.short_name || "null").toLowerCase();
        let district_name = (event.event_district_string || "null").toLowerCase();

        let contains_full = (full_name.indexOf(query) > -1);
        let contains_short = (short_name.indexOf(query) > -1);
        let contains_district = (district_name.indexOf(query) > -1);
        let contains_week = ((event.week || -1) == parseInt(query));
        let contains_year = ((event.year || -1) == parseInt(query));

        return contains_full || contains_short || contains_district || contains_week || contains_year;
      });
    } else {
      this.filtered_events = this.events;
    }
  }

}
export class TeamFilter {

  public filtered_teams: any;
  private teams: any;

  constructor(private teamsArray: any) {
    this.teams = teamsArray;
    this.filtered_teams = this.teams;
  }

  public filterTeams(e) {
    let value = e.target.value;

    if (value && value.trim() != '' && value != null) {
      this.filtered_teams = this.teams.filter((team) => {

        let query = value.toLowerCase();
        let full_name = (team.nickname || "null").toLowerCase();
        let full_number = (team.team_number + "" || "null").toLowerCase();

        let contains_full = (full_name.indexOf(query) > -1);
        let contains_number = (full_number.indexOf(query) > -1);

        return contains_full || contains_number;
      });
    } else {
      this.filtered_teams = this.teams;
    }
  }
}

export class MatchFilter {

  public filtered_matches: any;
  private matches: any;

  constructor(private matchesArray: any) {
    this.matches = matchesArray;
    this.filtered_matches = this.matches;
  }

  public filterMatches(e) {
    let value = e.target.value;

    if (value && value.trim() != '' && value != null) {
      this.filtered_matches = this.matches.filter((match) => {

        let query = value.toLowerCase();

        let contains_red_alliance = false;
        let contains_blue_alliance = false;

        for (let i = 0; i < match.alliances.red.teams.length; i++) {
          let team = match.alliances.red.teams[i];
          if ((team.substring(3, team.length)).indexOf(query) > -1) {
            contains_red_alliance = true;
            break;
          }
        }

        for (let i = 0; i < match.alliances.blue.teams.length; i++) {
          let team = match.alliances.blue.teams[i];
          if ((team.substring(3, team.length)).indexOf(query) > -1) {
            contains_blue_alliance = true;
            break;
          }
        }

        return contains_red_alliance || contains_blue_alliance;

      });
    } else {
      this.filtered_matches = this.matches;
    }
  }
}
