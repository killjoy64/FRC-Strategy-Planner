export class MatchConverter {

  constructor() {

  }

  convert(match) {
    let type = match.comp_level;
    let num = match.match_number;
    let set = match.set_number;

    let output = "";

    if (type == "qm") {
      output+= "Qualifier ";
    } else if (type == "ef") {
      output+= "Eighths Final " + set + " ";
    } else if (type == "qf") {
      output+= "Quarter Final " + set + " ";
    } else if (type == "sf") {
      output+= "Semi Final " + set + " ";
    } else if (type == "f") {
      output+= "Final ";
    }

    output += "Match " + num;

    return output;

  }

}
