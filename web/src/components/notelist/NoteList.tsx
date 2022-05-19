import * as React from "react";
import { ApplicationContext, ApplicationContextInterface } from "@notes/web";
import { Component, Context, ContextType, ReactElement } from "react";
import { CreateNote, ListNotes } from "@notes/model/services";
import { DispatcherInterface } from "@notes/model/event";
import { Icon } from "@notes/web/components";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { Note } from "@notes/model/entities";
import { NoteEvent, NoteUpdatedEvent } from "@notes/model/events";
import { NoteListItem, NoteSearch } from "@notes/web/components/notelist";
import { PropsInterface, StateInterface } from ".";
import { ValidatorError } from "@moonwalkingbits/apollo/validation";

/**
 * Represents a list of selectable note entities.
 */
class NoteList extends Component<PropsInterface, StateInterface> {
    /**
     * Context type definition.
     */
    public static contextType: Context<ApplicationContextInterface> = ApplicationContext;

    /**
     * Context instance.
     */
    declare context: ContextType<typeof ApplicationContext>;

    /**
     * Note listing service.
     */
    private listNotes!: ListNotes;

    /**
     * Note creation service.
     */
    private createNote!: CreateNote;

    /**
     * Application event dispatcher.
     */
    private dispatcher!: DispatcherInterface

    /**
     * Application logger.
     */
    private logger!: LoggerInterface;

    /**
     * Create a new note list component instance.
     *
     * @param props Component properties.
     */
    public constructor(props: PropsInterface) {
        super(props);

        this.state = {
            isLoading: false,
            isCreating: false,
            notes: []
        };
    }

    /**
     * Resolve component dependencies and fetch notes.
     */
    public componentDidMount(): void {
        this.listNotes = this.context.container.get("listNotes");
        this.createNote = this.context.container.get("createNote");
        this.dispatcher = this.context.container.get("eventDispatcher");
        this.logger = this.context.container.get("logger");

        this.dispatcher.addListener<Note>("note:created", this.handleNoteChange.bind(this));
        this.dispatcher.addListener<Note>("note:updated", this.handleNoteChange.bind(this));
        this.dispatcher.addListener<Note>("note:deleted", this.handleNoteChange.bind(this));

        this.setState(() => ({isLoading: true}), async () => {
            try {
                const notes = await this.listNotes.matching({});

                this.setState(() => ({notes: Array.from(notes)}));
            } catch (error) {
                this.logger.error("Unable to fetch notes: {message}", {message: error.message});
            } finally {
                this.setState(() => ({isLoading: false}));
            }
        });
    }

    /**
     * Handle note change events.
     *
     * @param event Note entity event.
     * @param identifier Event identifier.
     */
    private handleNoteChange(event: NoteEvent | NoteUpdatedEvent, identifier: string): void {
        const note = event instanceof NoteUpdatedEvent ? event.payload[0] : event.payload;

        switch (identifier) {
            case "note:created":
                this.addNoteToList(note);
                break;
            case "note:updated":
                this.updateNoteInList(note);
                break;
            case "note:deleted":
                this.removeNoteFromList(note);
                break;
        }
    }

    /**
     * Add note to list.
     *
     * @param note Note entity instance.
     */
    private addNoteToList(note: Note): void {
        this.setState(() => ({
            notes: [
                ...this.state.notes,

                note
            ]
        }), () => this.handleSelection(note));
    }

    /**
     * Update note in list.
     *
     * @param note Note entity instance.
     */
    private updateNoteInList(note: Note): void {
        const index = this.state.notes.findIndex(n => n.id === note.id);

        if (!~index) {
            return;
        }

        const notes = this.state.notes.slice();

        notes[index] = note;

        this.setState(() => ({notes}));
    }

    /**
     * Remove note from list.
     *
     * @param note Note entity instance.
     */
    private removeNoteFromList(note: Note): void {
        const index = this.state.notes.findIndex(n => n.id === note.id);

        if (!~index) {
            return;
        }

        const notes = this.state.notes.slice();

        notes.splice(index, 1);

        this.setState(() => ({notes}), () => this.handleSelection(void 0));
    }

    /**
     * Propagate item selection.
     *
     * @param note Note entity instance.
     */
    private handleSelection(note?: Note): void {
        this.setState(() => ({selectedNote: note}), () => this.props.onSelection?.(note));
    }

    /**
     * Fetch notes matching the given search phrase.
     *
     * @param phrase Arbitrary search phrase.
     */
    private handleSearch(phrase: string): void {
        if (phrase === this.state.currentSearchPhrase) {
            return;
        }

        this.setState(() => ({isLoading: true}), async () => {
            try {
                const notes = await this.listNotes.matching({q: phrase});

                this.setState(() => ({notes: Array.from(notes)}));
            } catch (error) {
                this.logger.error("Unable to fetch notes: {message}", {message: error.message});
            } finally {
                this.setState(() => ({isLoading: false}), () => this.handleSelection());
            }
        });
    }

    /**
     * Create a new empty note.
     */
    private handleNewNote(): void {
        this.setState(() => ({isCreating: true}), async () => {
            try {
                const note = await this.createNote.fromObject({
                    title: "",
                    content: ""
                });

                this.props.onSelection?.(note);
            } catch (error) {
                if (error instanceof ValidatorError) {
                    this.logger.error(
                        Object.entries(error.errors)
                            .map(([ property, [ issue ] ]) => `${property}: ${issue}`)
                            .join(", ")
                    );

                    return;
                }

                this.logger.error("Could not create note: {message}", {message: error.message});
            } finally {
                this.setState(() => ({isCreating: false}));
            }
        });
    }

    /**
     * Produce a visual representation of the component.
     *
     * @return React element representing the component's current state.
     */
    public render(): ReactElement {
        return (
            <div className="note-list">
                <header className="note-list__header">
                    <NoteSearch onSearchIntent={this.handleSearch.bind(this)}/>
                    <button
                        className="button button--primary"
                        onClick={this.handleNewNote.bind(this)}
                        disabled={this.state.isCreating}
                    >
                        <Icon name="plus"/>
                        Add note
                    </button>
                </header>
                <div className="note-list__notes">
                    {this.state.notes.map(note => (
                        <NoteListItem
                            key={note.id}
                            note={note}
                            onClick={this.handleSelection.bind(this)}
                            isSelected={note.id === this.state.selectedNote?.id}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default NoteList;
