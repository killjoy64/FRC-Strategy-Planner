export class EventFilter {

  private events: any;
  private filteredEvents: any;

  constructor(private eventsArray: any) {
    this.events = eventsArray;
    this.filteredEvents = this.events;
  }

  public setEvents(items) {
    this.events = items;
    this.filteredEvents = items;
  }

  public getFilteredData() {
    return this.filteredEvents;
  }

  public filterEvents(e) {
    let value = e.target.value;

    if (value && value.trim() != '' && value != null) {
      this.filteredEvents = this.events.filter((event) => {

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
      this.filteredEvents = this.events;
    }
  }

}
