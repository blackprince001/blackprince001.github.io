// Legacy sidenotes - redirecting to new margin notes system
// This file maintains backward compatibility

import { MarginNoteMarker, AutoNumberedMarginNote, resetMarginNoteCounter } from "./margin-notes"

export const resetSidenoteCounter = resetMarginNoteCounter
export const Sidenote = MarginNoteMarker
export const AutoNumberedSidenote = AutoNumberedMarginNote

export default Sidenote
