import ts from 'typescript';
import { CodeFactoryOptions } from '../util/types';
import { createInterface } from './parts/interface';
import { createProperty } from './parts/property';
import { createVariableType } from './parts/variable-type';
import { CodeNodeInterface } from '../types/interface';
import { CodeNodeProperty } from '../types/property';
import { CodeNodeVariableType } from '../types/variable-type';

export interface CodeFactory {
  readonly f: ts.NodeFactory;
  readonly options: CodeFactoryOptions;

  interface(input: CodeNodeInterface): ts.InterfaceDeclaration;

  property(input: CodeNodeProperty): ts.PropertySignature;

  variableType(input: CodeNodeVariableType): ts.TypeNode;
}

export function createCodeFactory(
  f: ts.NodeFactory,
  options: CodeFactoryOptions
): CodeFactory {
  return new CodeFactoryImpl(f, options);
}

class CodeFactoryImpl implements CodeFactory {
  public constructor(
    public readonly f: ts.NodeFactory,
    public readonly options: CodeFactoryOptions
  ) {}

  public interface(input: CodeNodeInterface): ts.InterfaceDeclaration {
    return createInterface(this, input);
  }

  public property(input: CodeNodeProperty): ts.PropertySignature {
    return createProperty(this, input);
  }

  public variableType(input: CodeNodeVariableType): ts.TypeNode {
    return createVariableType(this, input);
  }
}
