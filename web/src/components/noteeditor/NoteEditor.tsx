import * as React from "react";
import { ApplicationContext, ApplicationContextInterface, debounce } from "@notes/web";
import { Component, Context, ContextType, ReactElement, RefObject, createRef } from "react";
import { DeleteNote, PatchNote } from "@notes/model/services";
import { Icon } from "@notes/web/components";
import { PropsInterface, StateInterface } from ".";

/**
 * Represents an interactive note editor.
 */
class NoteEditor extends Component<PropsInterface, StateInterface> {
    /**
     * Context type definition.
     */
    public static contextType: Context<ApplicationContextInterface> = ApplicationContext;

    /**
     * Component default properties.
     */
    public static defaultProps = {
        autoSaveThreshold: 500
    };

    /**
     * Context instance.
     */
    declare context: ContextType<typeof ApplicationContext>;

    /**
     * Reference to the title input element.
     */
    private readonly titleInputRef: RefObject<HTMLInputElement>;

    /**
     * Reference to the content input element.
     */
    private readonly contentInputRef: RefObject<HTMLTextAreaElement>;

    /**
     * Note patching service.
     */
    private patchNote!: PatchNote;

    /**
     * Note removal service.
     */
    private deleteNote!: DeleteNote;

    /**
     * Create a new note editor component instance.
     *
     * @param props Component properties.
     */
    public constructor(props: PropsInterface) {
        super(props);

        this.titleInputRef = createRef();
        this.contentInputRef = createRef();
    }

    /**
     * Resolve component dependencies.
     */
    public componentDidMount(): void {
        this.patchNote = this.context.container.get("patchNote");
        this.deleteNote = this.context.container.get("deleteNote");
    }

    /**
     * Update input references.
     *
     * @param nextProps Next properties object.
     * @param _ Next context.
     */
    public UNSAFE_componentWillReceiveProps(nextProps: PropsInterface, _: any): void {
        this.titleInputRef.current!.value = nextProps.note.title;
        this.contentInputRef.current!.value = nextProps.note.content;
    }

    /**
     * Save current version of the edited note.
     *
     * @return Promise resolving when the operation is done.
     */
    private async save(): Promise<void> {
        const note = await this.patchNote.withObject(
            this.props.note,
            {
                title: this.titleInputRef.current!.value,
                content: this.contentInputRef.current!.value
            }
        );

        this.props.onSave?.(note);
    }

    /**
     * Delete edited note.
     *
     * @return Promise resolving when the operation is done.
     */
    private async delete(): Promise<void> {
        await this.deleteNote.byReference(this.props.note);

        this.props.onRemove?.(this.props.note);
    }

    /**
     * Produce a visual representation of the component.
     *
     * @return React element representing the component's current state.
     */
    public render(): ReactElement {
        return (
            <div className="note">
                <div className="note__header">
                    <div className="note__actions">
                        <button onClick={this.delete.bind(this)}>
                            <Icon name="trash"/>
                        </button>
                    </div>
                    <div className="note__title">
                        <input
                            ref={this.titleInputRef}
                            type="text"
                            defaultValue={this.props.note.title}
                            placeholder="Title..."
                            onChange={debounce(this.save.bind(this), this.props.autoSaveThreshold)}
                        />
                    </div>
                </div>
                <div className="note__content">
                    <textarea
                        ref={this.contentInputRef}
                        defaultValue={this.props.note.content}
                        placeholder="Content..."
                        onChange={debounce(this.save.bind(this), this.props.autoSaveThreshold)}
                    />
                </div>
            </div>
        );
    }
}

export default NoteEditor;
