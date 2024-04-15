// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdProjectScopedContainers {
  static makeNewEmptyProjectScopedContainers(): gdProjectScopedContainers;
  static makeNewProjectScopedContainersForProjectAndLayout(project: gdProject, layout: gdLayout): gdProjectScopedContainers;
  static makeNewProjectScopedContainersFor(globalObjectsContainer: gdObjectsContainer, objectsContainer: gdObjectsContainer): gdProjectScopedContainers;
  static makeNewProjectScopedContainersWithLocalVariables(projectScopedContainers: gdProjectScopedContainers, event: gdBaseEvent): gdProjectScopedContainers;
  addPropertiesContainer(propertiesContainer: gdPropertiesContainer): gdProjectScopedContainers;
  addParameters(parameters: gdVectorParameterMetadata): gdProjectScopedContainers;
  getObjectsContainersList(): gdObjectsContainersList;
  getVariablesContainersList(): gdVariablesContainersList;
  delete(): void;
  ptr: number;
};