// variables used to change the setting div content
// devault settings html 
var def_setts = '<label for="number"> Number of repetitions </label>'+
                '<input type="number" id = "num_ex" name = "num_ex" value = "35"><p>'
// settings specific to melodic intervals
var mel_setts = '<label for="direction"> Type of Interval </label>'+
                '<select id = "direction"><option value="both">Both</option>'+
                                         '<option value="up">Ascending</option>'+
                                         '<option value="down">Desending</option>'+
                '</select>'
// setting specidic to chords
var mel_setts = '<label for="direction"> Type of Interval </label>'+
                '<select id = "direction"><option value="both">Both</option>'+
                                         '<option value="up">Ascending</option>'+
                                         '<option value="down">Desending</option>'+
                '</select>'
// variables used to change the choice div content
// checkbox for intervals
var intervals = '<input type="checkbox" class = "selected" id="int1" name="int1" value="1"><label for="int1"> Minor Second</label><br>'+
                '<input type="checkbox" class = "selected" id="int2" name="int2" value="2"><label for="int2"> Major Second</label><br>'+
                '<input type="checkbox" class = "selected" id="int3" name="int3" value="3"><label for="int3"> Minor Third</label><br>'+
                '<input type="checkbox" class = "selected" id="int4" name="int4" value="4"><label for="int4"> Major Third</label><br>'+
                '<input type="checkbox" class = "selected" id="int5" name="int5" value="5"><label for="int5"> Perfect Forth</label><br>'+
                '<input type="checkbox" class = "selected" id="int6" name="int6" value="6"><label for="int6"> Tritone</label><br>'+
                '<input type="checkbox" class = "selected" id="int7" name="int7" value="7"><label for="int7"> Perfect Fifth</label><br>'+
                '<input type="checkbox" class = "selected" id="int8" name="int8" value="8"><label for="int8"> Minor Sixth</label><br>'+
                '<input type="checkbox" class = "selected" id="int9" name="int9" value="9"><label for="int9"> Major Sixth</label><br>'+
                '<input type="checkbox" class = "selected" id="int10" name="int10" value="10"><label for="int10"> Minor Seventh</label><br>'+
                '<input type="checkbox" class = "selected" id="int11" name="int11" value="11"><label for="int11"> Major Seventh</label><br>'+
                '<input type="checkbox" class = "selected" id="int12" name="int12" value="12"><label for="int12"> Octave</label><br></br>'
            
// checkbox for triads
var triads = '<input type="checkbox" class = "selected" id="min" name="min" value="1">'+
             '<label for="min"> Minor</label><br>'+
             '<input type="checkbox" class = "selected" id="maj" name="maj" value="2">'+
             '<label for="maj"> Major</label><br>'+
             '<input type="checkbox" class = "selected" id="dim" name="dim" value="3">'+
             '<label for="dim"> Diminished </label><br>'+
             '<input type="checkbox" class = "selected" id="aug" name="aug" value="4">'+
             '<label for="aug"> Augmented</label><br>'
// checkbox for seventh
var seventh = '<input type="checkbox" class = "selected" id="min7" name="min7" value="5">'+
              '<label for="min7"> Minor 7th</label><br>'+
              '<input type="checkbox" class = "selected" id="maj7" name="maj7" value="6">'+
              '<label for="maj7"> Major 7th</label><br>'+
              '<input type="checkbox" class = "selected" id="dom7" name="dom7" value="7">'+
              '<label for="dom7"> Dominant 7th</label><br>'+
              '<input type="checkbox" class = "selected" id="half-dim" name="half-dim" value="8">'+
              '<label for="half-dim"> Minor 7th (b5)</label><br>' 
// checkbox for other chords
var other = '<input type="checkbox" class = "selected" id="min7+b5" name="min7+b5" value="10">'+
            '<label for="min7+b5"> Minor maj7 (b5)</label><br>'+
            '<input type="checkbox" class = "selected" id="maj#5" name="maj#5" value="12">'+
            '<label for="maj#5"> Major 7th (#5)</label><br>'+
            '<input type="checkbox" class = "selected" id="dom7#5" name="dom7#5" value="13">'+
            '<label for="dom7#5"> Dominant 7th (#5)</label><br>'+
            '<input type="checkbox" class = "selected" id="dom7b5" name="dom7b5" value="14">'+
            '<label for="dom7b5"> Dominant 7th (b5)</label><br>'
// extra triads
var other_triads = '<input type="checkbox" class = "selected" id="sus2" name="sus2" value="15">'+
                   '<label for="sus2"> Lydian Triad</label><br>'+
                   '<input type="checkbox" class = "selected" id="sus4" name="sus4" value="16">'+
                   '<label for="sus4"> Phrygian Triad</label><br>'+
                   '<input type="checkbox" class = "selected" id="lyd" name="lyd" value="17">'+
                   '<label for="lyd"> Lydian Triad</label><br>'+
                   '<input type="checkbox" class = "selected" id="phr" name="phr" value="18">'+
                   '<label for="phr"> Phrygian Triad</label><br>'+
                   '<input type="checkbox" class = "selected" id="loc" name="loc" value="19">'+
                   '<label for="min"> Locrian Triad</label><br>'
// extra seventh chords
var other_seventh = '<input type="checkbox" class = "selected" id="min7+" name="min7+" value="9">'+
                    '<label for="min7+"> Minor maj7</label><br>'+
                    '<input type="checkbox" class = "selected" id="dim7" name="dim7" value="11">'+
                    '<label for="dim7"> Diminished 7th</label><br>'+
                    '<input type="checkbox" class = "selected" id="min6" name="min6" value="20">'+
                    '<label for="min6"> Minor 6th</label><br>'+
                    '<input type="checkbox" class = "selected" id="maj6" name="maj6" value="21">'+
                    '<label for="maj6"> Major 6th</label><br>'