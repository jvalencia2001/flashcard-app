export class ServiceResponse<T> {
  serviceName: string;
  serviceData?: T;
  serviceMessage: string;

  constructor(name: string, message: string, data?: T) {
    this.serviceName = name;
    this.serviceMessage = message;
    this.serviceData = data;
  }
}
