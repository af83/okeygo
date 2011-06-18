# Help for parse the txt file

# This is from the performous code

As an example this is a lyrics line:

    : 20 6 64  dreams,

The first caractere from the lyrics line correspond at:

```cpp
game/notes.hh:
enum Type { FREESTYLE = 'F', NORMAL = ':', GOLDEN = '*', SLIDE = '+', SLEEP = '-',
    TAP = '1', HOLDBEGIN = '2', HOLDEND = '3', ROLL = '4', MINE = 'M', LIFT = 'L'} type;
```

The forth item on the lyric line correspond at a Midi Note:
http://tomscarff.110mb.com/midi_analyser/midi_note_numbers_for_octaves.htm

In this system, middle C (MIDI note number 60) is C4.  A MIDI note number of 69
is used for A440 tuning, that is the A note above middle C.
