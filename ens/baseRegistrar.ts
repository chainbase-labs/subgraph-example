import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ControllerAdded extends ethereum.Event {
  get params(): ControllerAdded__Params {
    return new ControllerAdded__Params(this);
  }
}

export class ControllerAdded__Params {
  _event: ControllerAdded;

  constructor(event: ControllerAdded) {
    this._event = event;
  }

  get controller(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class ControllerRemoved extends ethereum.Event {
  get params(): ControllerRemoved__Params {
    return new ControllerRemoved__Params(this);
  }
}

export class ControllerRemoved__Params {
  _event: ControllerRemoved;

  constructor(event: ControllerRemoved) {
    this._event = event;
  }

  get controller(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class NameMigrated extends ethereum.Event {
  get params(): NameMigrated__Params {
    return new NameMigrated__Params(this);
  }
}

export class NameMigrated__Params {
  _event: NameMigrated;

  constructor(event: NameMigrated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get expires(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NameRegistered extends ethereum.Event {
  get params(): NameRegistered__Params {
    return new NameRegistered__Params(this);
  }
}

export class NameRegistered__Params {
  _event: NameRegistered;

  constructor(event: NameRegistered) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get expires(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NameRenewed extends ethereum.Event {
  get params(): NameRenewed__Params {
    return new NameRenewed__Params(this);
  }
}

export class NameRenewed__Params {
  _event: NameRenewed;

  constructor(event: NameRenewed) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get expires(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get approved(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class BaseRegistrar extends ethereum.SmartContract {
  static bind(address: Address): BaseRegistrar {
    return new BaseRegistrar("BaseRegistrar", address);
  }

  supportsInterface(interfaceID: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceID)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceID: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceID)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getApproved(tokenId: BigInt): Address {
    let result = super.call("getApproved", "getApproved(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_getApproved(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getApproved",
      "getApproved(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ens(): Address {
    let result = super.call("ens", "ens():(address)", []);

    return result[0].toAddress();
  }

  try_ens(): ethereum.CallResult<Address> {
    let result = super.tryCall("ens", "ens():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  transferPeriodEnds(): BigInt {
    let result = super.call(
      "transferPeriodEnds",
      "transferPeriodEnds():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_transferPeriodEnds(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "transferPeriodEnds",
      "transferPeriodEnds():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ownerOf(tokenId: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(tokenId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(tokenId)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  MIGRATION_LOCK_PERIOD(): BigInt {
    let result = super.call(
      "MIGRATION_LOCK_PERIOD",
      "MIGRATION_LOCK_PERIOD():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_MIGRATION_LOCK_PERIOD(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "MIGRATION_LOCK_PERIOD",
      "MIGRATION_LOCK_PERIOD():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOf(owner: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(owner: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(owner)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isOwner(): boolean {
    let result = super.call("isOwner", "isOwner():(bool)", []);

    return result[0].toBoolean();
  }

  try_isOwner(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isOwner", "isOwner():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  available(id: BigInt): boolean {
    let result = super.call("available", "available(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(id)
    ]);

    return result[0].toBoolean();
  }

  try_available(id: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("available", "available(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(id)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  previousRegistrar(): Address {
    let result = super.call(
      "previousRegistrar",
      "previousRegistrar():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_previousRegistrar(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "previousRegistrar",
      "previousRegistrar():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  GRACE_PERIOD(): BigInt {
    let result = super.call("GRACE_PERIOD", "GRACE_PERIOD():(uint256)", []);

    return result[0].toBigInt();
  }

  try_GRACE_PERIOD(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("GRACE_PERIOD", "GRACE_PERIOD():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  renew(id: BigInt, duration: BigInt): BigInt {
    let result = super.call("renew", "renew(uint256,uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(id),
      ethereum.Value.fromUnsignedBigInt(duration)
    ]);

    return result[0].toBigInt();
  }

  try_renew(id: BigInt, duration: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("renew", "renew(uint256,uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(id),
      ethereum.Value.fromUnsignedBigInt(duration)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  nameExpires(id: BigInt): BigInt {
    let result = super.call("nameExpires", "nameExpires(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(id)
    ]);

    return result[0].toBigInt();
  }

  try_nameExpires(id: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "nameExpires",
      "nameExpires(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  controllers(param0: Address): boolean {
    let result = super.call("controllers", "controllers(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBoolean();
  }

  try_controllers(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("controllers", "controllers(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  baseNode(): Bytes {
    let result = super.call("baseNode", "baseNode():(bytes32)", []);

    return result[0].toBytes();
  }

  try_baseNode(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("baseNode", "baseNode():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  isApprovedForAll(owner: Address, operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    owner: Address,
    operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(operator)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  register(id: BigInt, owner: Address, duration: BigInt): BigInt {
    let result = super.call(
      "register",
      "register(uint256,address,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(duration)
      ]
    );

    return result[0].toBigInt();
  }

  try_register(
    id: BigInt,
    owner: Address,
    duration: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "register",
      "register(uint256,address,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromAddress(owner),
        ethereum.Value.fromUnsignedBigInt(duration)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }
}

export class ReclaimCall extends ethereum.Call {
  get inputs(): ReclaimCall__Inputs {
    return new ReclaimCall__Inputs(this);
  }

  get outputs(): ReclaimCall__Outputs {
    return new ReclaimCall__Outputs(this);
  }
}

export class ReclaimCall__Inputs {
  _call: ReclaimCall;

  constructor(call: ReclaimCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get owner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ReclaimCall__Outputs {
  _call: ReclaimCall;

  constructor(call: ReclaimCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SetResolverCall extends ethereum.Call {
  get inputs(): SetResolverCall__Inputs {
    return new SetResolverCall__Inputs(this);
  }

  get outputs(): SetResolverCall__Outputs {
    return new SetResolverCall__Outputs(this);
  }
}

export class SetResolverCall__Inputs {
  _call: SetResolverCall;

  constructor(call: SetResolverCall) {
    this._call = call;
  }

  get resolver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetResolverCall__Outputs {
  _call: SetResolverCall;

  constructor(call: SetResolverCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class AddControllerCall extends ethereum.Call {
  get inputs(): AddControllerCall__Inputs {
    return new AddControllerCall__Inputs(this);
  }

  get outputs(): AddControllerCall__Outputs {
    return new AddControllerCall__Outputs(this);
  }
}

export class AddControllerCall__Inputs {
  _call: AddControllerCall;

  constructor(call: AddControllerCall) {
    this._call = call;
  }

  get controller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AddControllerCall__Outputs {
  _call: AddControllerCall;

  constructor(call: AddControllerCall) {
    this._call = call;
  }
}

export class SafeTransferFrom1Call extends ethereum.Call {
  get inputs(): SafeTransferFrom1Call__Inputs {
    return new SafeTransferFrom1Call__Inputs(this);
  }

  get outputs(): SafeTransferFrom1Call__Outputs {
    return new SafeTransferFrom1Call__Outputs(this);
  }
}

export class SafeTransferFrom1Call__Inputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class SafeTransferFrom1Call__Outputs {
  _call: SafeTransferFrom1Call;

  constructor(call: SafeTransferFrom1Call) {
    this._call = call;
  }
}

export class RenewCall extends ethereum.Call {
  get inputs(): RenewCall__Inputs {
    return new RenewCall__Inputs(this);
  }

  get outputs(): RenewCall__Outputs {
    return new RenewCall__Outputs(this);
  }
}

export class RenewCall__Inputs {
  _call: RenewCall;

  constructor(call: RenewCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get duration(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RenewCall__Outputs {
  _call: RenewCall;

  constructor(call: RenewCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class AcceptRegistrarTransferCall extends ethereum.Call {
  get inputs(): AcceptRegistrarTransferCall__Inputs {
    return new AcceptRegistrarTransferCall__Inputs(this);
  }

  get outputs(): AcceptRegistrarTransferCall__Outputs {
    return new AcceptRegistrarTransferCall__Outputs(this);
  }
}

export class AcceptRegistrarTransferCall__Inputs {
  _call: AcceptRegistrarTransferCall;

  constructor(call: AcceptRegistrarTransferCall) {
    this._call = call;
  }

  get label(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get deed(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class AcceptRegistrarTransferCall__Outputs {
  _call: AcceptRegistrarTransferCall;

  constructor(call: AcceptRegistrarTransferCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class RemoveControllerCall extends ethereum.Call {
  get inputs(): RemoveControllerCall__Inputs {
    return new RemoveControllerCall__Inputs(this);
  }

  get outputs(): RemoveControllerCall__Outputs {
    return new RemoveControllerCall__Outputs(this);
  }
}

export class RemoveControllerCall__Inputs {
  _call: RemoveControllerCall;

  constructor(call: RemoveControllerCall) {
    this._call = call;
  }

  get controller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RemoveControllerCall__Outputs {
  _call: RemoveControllerCall;

  constructor(call: RemoveControllerCall) {
    this._call = call;
  }
}

export class RegisterCall extends ethereum.Call {
  get inputs(): RegisterCall__Inputs {
    return new RegisterCall__Inputs(this);
  }

  get outputs(): RegisterCall__Outputs {
    return new RegisterCall__Outputs(this);
  }
}

export class RegisterCall__Inputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }

  get id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get owner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get duration(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class RegisterCall__Outputs {
  _call: RegisterCall;

  constructor(call: RegisterCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _ens(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _previousRegistrar(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _baseNode(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get _transferPeriodEnds(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

