interface NodeListSource {
  getNodeList(): Promise<string[]>,
}

export { NodeListSource };
