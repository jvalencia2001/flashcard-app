export class ServiceResponse<T> {
  _serviceName: string;
  _serviceData?: Array<T>;
  _serviceMessage: string;

  constructor(name: string, message: string, data?: Array<T>) {
    this._serviceName = name;
    this._serviceMessage = message;
    this._serviceData = data;
  }
}
