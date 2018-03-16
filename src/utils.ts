import * as React from 'react';

export function classNames(classNameList: (false|undefined|null|string)[]) {
    return classNameList.filter(x => typeof x === 'string').join(' ');
}

export function unreachableCode(message: string = 'runtime error'): never {
    throw new Error(message);
}

/** if resolve 'cancel', cancels default action */
export type CancelableHandler = <EventT = React.SyntheticEvent<any>>(evt: EventT) => Promise<'cancel'|void>;
