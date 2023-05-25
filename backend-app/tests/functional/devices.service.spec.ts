import { test } from "@japa/runner";
import { HTTP_RESPONSE_STATUS } from "App/Dtos/HTTP_TYPES";
import DevicesService from "App/Services/Devices.service";
import ResponseFunctionsService from "App/Services/ResponsesFunctions.service";
import {Type_Enum} from "App/Dtos/DevicesDto";

test.group("DevicesService", (group) => {
  const responseFunc = new ResponseFunctionsService();
  const devicesService = new DevicesService(responseFunc);
  let deviceId: number = 0;

  group.setup(async () => {
    // Do something before each test in group
  });

  group.teardown(async () => {
    // Do something after each test in group
  });

  test("create device", async ({assert}) => {
    const response = await devicesService.create({
      name: "Device",
      owner_name: "John Doe",
      type: Type_Enum.tablet,
      status: 10
    });
    assert.equal(typeof response.data!.id, "number");
    assert.equal(response.status, HTTP_RESPONSE_STATUS.CREATED);
    assert.equal(response.data!.name, "Device");
    assert.equal(response.data!.owner_name, "John Doe");
    assert.equal(response.data!.type, "Tablet");
    assert.equal(response.data!.status, 10);
    deviceId = response.data!.id
  });

  test("update device", async ({assert}) => {
    const response = await devicesService.update(deviceId, {
      name: "New device",
      owner_name: "John Doe",
      type: Type_Enum.smartphone,
      status: 75
    });
    assert.equal(typeof response.data!.id, "number");
    assert.equal(response.status, HTTP_RESPONSE_STATUS.OK);
    assert.equal(response.data!.name, "New device");
    assert.equal(response.data!.owner_name, "John Doe");
    assert.equal(response.data!.type, "Smartphone");
    assert.equal(response.data!.status, 75);
  });

  test("get all devices", async ({assert}) => {
    const response = await devicesService.getAll(1, 10);
    assert.equal(response.status, HTTP_RESPONSE_STATUS.OK);
    assert.isArray(response.data);
  });

  test("get device by id", async ({assert}) => {
    const response = await devicesService.get(deviceId);
    assert.equal(typeof response.data!.id, "number");
    assert.equal(response.status, HTTP_RESPONSE_STATUS.OK);
    assert.equal(response.data!.name, "New device");
    assert.equal(response.data!.owner_name, "John Doe");
    assert.equal(response.data!.type, "Smartphone");
    assert.equal(response.data!.status, 75);
  });

  test("delete device", async ({assert}) => {
    const response = await devicesService.delete(deviceId);
    assert.equal(response.status, HTTP_RESPONSE_STATUS.OK);
    assert.equal(response.data!.id, deviceId);
  });

})
