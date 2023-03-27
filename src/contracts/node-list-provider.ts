interface NodeListProvider {
  getNodeList(): Promise<string[]>,
}

export { NodeListProvider };
