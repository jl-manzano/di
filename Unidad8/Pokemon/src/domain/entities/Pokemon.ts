export class Pokemon {
  private _id: string;
  private _name: string;
  private _url: string;

  constructor(id: string, name: string, url: string) {
    this._id = id;
    this._name = name;
    this._url = url;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get url(): string {
    return this._url;
  }
}