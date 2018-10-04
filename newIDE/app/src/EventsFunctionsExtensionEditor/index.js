// @flow
import * as React from 'react';
import EventsSheet from '../EventsSheet';
import EditorMosaic, { MosaicWindow } from '../UI/EditorMosaic';
import EmptyMessage from '../UI/EmptyMessage';
import EventsFunctionConfigurationEditor from './EventsFunctionConfigurationEditor';
import EventsFunctionsList from '../EventsFunctionsList';
import Background from '../UI/Background';
import OptionsEditorDialog from './OptionsEditorDialog';
const gd = global.gd;

type Props = {|
  project: gdProject,
  eventsFunctionsExtension: gdEventsFunctionsExtension,
  setToolbar: (?React.Node) => void,
|};

type State = {|
  selectedEventsFunction: ?gdEventsFunction,
  editOptionsDialogOpen: boolean,
|};

export default class EventsFunctionsExtensionEditor extends React.Component<
  Props,
  State
> {
  state = {
    selectedEventsFunction: null,
    editOptionsDialogOpen: false,
  };
  editor: ?EventsSheet;
  _editors: ?EditorMosaic;
  _globalObjectsContainer: ?gdObjectsContainer;
  _objectsContainer: ?gdObjectsContainer;

  componentWillUnmount() {
    if (this._globalObjectsContainer) this._globalObjectsContainer.delete();
    if (this._objectsContainer) this._objectsContainer.delete();
  }

  _loadEventsFunctionFrom = (
    project: gdProject,
    eventsFunction: gdEventsFunction
  ) => {
    if (this._globalObjectsContainer) this._globalObjectsContainer.delete();
    this._globalObjectsContainer = new gd.ObjectsContainer();

    if (this._objectsContainer) this._objectsContainer.delete();
    this._objectsContainer = new gd.ObjectsContainer();

    gd.ParameterMetadataTools.parametersToObjectsContainer(
      project,
      eventsFunction.getParameters(),
      this._objectsContainer
    );
  };

  updateToolbar() {
    if (this.editor) this.editor.updateToolbar();
  }

  _selectEventsFunction = (selectedEventsFunction: gdEventsFunction) => {
    this._loadEventsFunctionFrom(this.props.project, selectedEventsFunction);
    this.setState(
      {
        selectedEventsFunction,
      },
      () => this.updateToolbar()
    );
  };

  _renameEventsFunction = (
    eventsFunction: gdEventsFunction,
    newName: string,
    cb: boolean => void
  ) => {
    const { project, eventsFunctionsExtension } = this.props;
    gd.WholeProjectRefactorer.renameEventsFunction(
      project,
      eventsFunctionsExtension,
      eventsFunction.getName(),
      newName
    );

    cb(true);
  };

  _editOptions = (open: boolean = true) => {
    this.setState({
      editOptionsDialogOpen: open,
    });
  };

  render() {
    const { project, eventsFunctionsExtension } = this.props;
    const { selectedEventsFunction, editOptionsDialogOpen } = this.state;

    console.log(editOptionsDialogOpen);
    return (
      <React.Fragment>
        <EditorMosaic
          ref={editors => (this._editors = editors)}
          editors={{
            parameters: (
              <MosaicWindow
                title="Function Configuration"
                toolbarControls={[]}
                selectedEventsFunction={selectedEventsFunction}
              >
                <Background>
                  {selectedEventsFunction ? (
                    <EventsFunctionConfigurationEditor
                      eventsFunction={selectedEventsFunction}
                      onParametersUpdated={() => {
                        this._loadEventsFunctionFrom(
                          project,
                          selectedEventsFunction
                        );
                        this.forceUpdate();
                      }}
                    />
                  ) : (
                    <EmptyMessage>
                      Choose a function to set the parameters that it accepts.
                    </EmptyMessage>
                  )}
                </Background>
              </MosaicWindow>
            ),
            'events-sheet':
              selectedEventsFunction &&
              this._globalObjectsContainer &&
              this._objectsContainer ? (
                <EventsSheet
                  ref={editor => (this.editor = editor)}
                  project={project}
                  layout={null}
                  globalObjectsContainer={this._globalObjectsContainer}
                  objectsContainer={this._objectsContainer}
                  events={selectedEventsFunction.getEvents()}
                  showPreviewButton={false}
                  onPreview={options => {
                    /*TODO*/
                  }}
                  showNetworkPreviewButton={false}
                  onOpenExternalEvents={() => {
                    /*TODO*/
                  }}
                  onOpenLayout={() => {
                    /*TODO*/
                  }}
                  resourceSources={[]}
                  onChooseResource={() => {
                    /*TODO*/
                    return Promise.reject(new Error('Unimplemented'));
                  }}
                  resourceExternalEditors={[]}
                  setToolbar={this.props.setToolbar}
                  onOpenDebugger={() => {
                    /*TODO*/
                  }}
                  onOpenSettings={() => {}}
                />
              ) : (
                <Background>
                  <EmptyMessage>
                    Choose a function to edit its events.
                  </EmptyMessage>
                </Background>
              ),
            'functions-list': (
              <MosaicWindow
                title="Functions list"
                toolbarControls={[]}
                selectedEventsFunction={selectedEventsFunction}
              >
                <EventsFunctionsList
                  project={project}
                  eventsFunctions={eventsFunctionsExtension.getEventsFunctions()}
                  selectedEventsFunction={selectedEventsFunction}
                  onSelectEventsFunction={this._selectEventsFunction}
                  onDeleteEventsFunction={() => {
                    /*TODO*/
                  }}
                  onRenameEventsFunction={this._renameEventsFunction}
                  onEditOptions={this._editOptions}
                />
              </MosaicWindow>
            ),
          }}
          initialNodes={{
            direction: 'row',
            first: {
              direction: 'column',
              first: 'parameters',
              second: 'events-sheet',
              splitPercentage: 25,
            },
            second: 'functions-list',
            splitPercentage: 66,
          }}
        />
        {editOptionsDialogOpen && (
          <OptionsEditorDialog
            eventsFunctionsExtension={eventsFunctionsExtension}
            open
            onClose={() => this._editOptions(false)}
          />
        )}
      </React.Fragment>
    );
  }
}
