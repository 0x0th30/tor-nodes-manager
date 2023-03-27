interface INodeListProvider {
  getNodeList(): Promise<string[]>,
}

export { INodeListProvider };
