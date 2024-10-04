var notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// text for the interval buttons
var interval_text = ['Minor Second',
                     'Major Second',
                     'Minor Third', 
                     'Major Third', 
                     'Perfect Forth', 
                     'Tritone', 
                     'Perfect Fifth', 
                     'Minor Sixth', 
                     'Major Sixth', 
                     'Minor Seventh', 
                     'Major Seventh', 
                     'Octave']
// text for the chord buttons
var chord_text = ['Minor Triad',            //  1
                  'Major Triad',            //  2
                  'Diminished Triad',       //  3
                  'Augmented Triad',        //  4
                  'Minor Seventh',          //  5
                  'Major Seventh',          //  6
                  'Dominant Seventh',       //  7 
                  'Half Deminished',        //  8
                  'Minor Major 7th',        //  9
                  'Minor Major 7th (b5)',   // 10
                  'Diminished Seventh',     // 11
                  'Major Seventh (#5)',     // 12
                  'Dominant Seventh (#5)',  // 13
                  'Dominant Seventh (b5)',  // 14
                  'Sus2 Triad',             // 15
                  'Sus4 Triad',             // 16
                  'Lydian Triad',           // 17
                  'Phrygian Triad',         // 18
                  'Locrian Triad',          // 19
                  'Minor Sixth',            // 20
                  'Major Sixth'             // 21
                  ]           

var chord_codes = ['3 7',                 //  1
                   '4 7',                 //  2
                   '3 6',                 //  3
                   '4 8',                 //  4
                   '3 7 10',              //  5
                   '4 7 11',              //  6
                   '4 7 10',              //  7
                   '3 6 10',              //  8
                   '3 7 11',              //  9
                   '3 6 11',              // 10
                   '6 3 9',               // 11
                   '4 8 11',              // 12
                   '4 8 10',              // 13
                   '4 6 10',              // 14
                   '2 7',                 // 15
                   '5 7',                 // 16
                   '6 7',                 // 17
                   '1 7',                 // 18
                   '1 6',                 // 19
                   '3 7 9',               // 20
                   '4 7 9'                // 21
                    ]

// controls for the chord exercises
var chord_controls = '<button id = "replay" onclick = "replay()" class = "controls_button">Replay</button>'+
                     '<button id = "replay" onclick = "root()" class = "controls_button">Root</button>'+
                     '<button id = "next" onclick = "next()" class = "controls_button">Next</button>'
// control for interval exercises
var interval_controls = '<button id = "replay" onclick = "replay()" class = "controls_button">Replay</button>'+
                        '<button id = "next" onclick = "next()" class = "controls_button">Next</button>'