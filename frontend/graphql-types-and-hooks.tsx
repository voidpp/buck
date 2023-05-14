import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSONString: any;
  Long: any;
};

export type AlarmTask = {
  __typename?: 'AlarmTask';
  eta?: Maybe<Scalars['String']>;
  isLast?: Maybe<Scalars['Boolean']>;
  isRevoked?: Maybe<Scalars['Boolean']>;
  timerId?: Maybe<Scalars['Int']>;
};

export type AppConfig = {
  __typename?: 'AppConfig';
  autoBacklight?: Maybe<AutoBacklight>;
  backlightSysfsPath?: Maybe<Scalars['String']>;
  sounds: Array<Maybe<Sound>>;
  weather?: Maybe<Weather>;
};

export type AutoBacklight = {
  __typename?: 'AutoBacklight';
  brightnessMin: Scalars['Int'];
  fadeDuration: Scalars['Float'];
  lightMax: Scalars['Int'];
  refresh: Scalars['Float'];
};

export type CeleryTaskList = {
  __typename?: 'CeleryTaskList';
  alarm?: Maybe<Array<Maybe<AlarmTask>>>;
};

export type CurrentWeather = {
  __typename?: 'CurrentWeather';
  conditionsImageUrl?: Maybe<Scalars['String']>;
  temperature?: Maybe<Scalars['Float']>;
};

export type DebugInfo = {
  __typename?: 'DebugInfo';
  celeryTasks?: Maybe<CeleryTaskList>;
  systemStats?: Maybe<SystemStats>;
  version?: Maybe<Scalars['String']>;
};

export type Error = {
  __typename?: 'Error';
  context?: Maybe<Scalars['JSONString']>;
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type InstanceResult = {
  __typename?: 'InstanceResult';
  errors?: Maybe<Array<Maybe<Error>>>;
  id?: Maybe<Scalars['Int']>;
};

export type Memory = {
  __typename?: 'Memory';
  available?: Maybe<Scalars['Long']>;
  free?: Maybe<Scalars['Long']>;
  percent?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Long']>;
  used?: Maybe<Scalars['Long']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteGroup?: Maybe<InstanceResult>;
  deletePredefinedTimer?: Maybe<InstanceResult>;
  operateTimer?: Maybe<ValidationResult>;
  saveGroup?: Maybe<InstanceResult>;
  savePredefinedTimer?: Maybe<InstanceResult>;
  saveSettings?: Maybe<Scalars['Boolean']>;
  saveTimer?: Maybe<InstanceResult>;
  setBrightness?: Maybe<Scalars['Boolean']>;
  startTimer?: Maybe<InstanceResult>;
};


export type MutationDeleteGroupArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePredefinedTimerArgs = {
  id: Scalars['Int'];
};


export type MutationOperateTimerArgs = {
  id: Scalars['Int'];
  operation: TimerOperation;
};


export type MutationSaveGroupArgs = {
  id?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
};


export type MutationSavePredefinedTimerArgs = {
  groupName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  length: Scalars['String'];
  name: Scalars['String'];
  soundFile?: InputMaybe<Scalars['String']>;
};


export type MutationSaveSettingsArgs = {
  isAutoBacklightEnabled?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveTimerArgs = {
  groupId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  timerId: Scalars['Int'];
};


export type MutationSetBrightnessArgs = {
  brightness: Scalars['Int'];
  fadeDuration?: InputMaybe<Scalars['Float']>;
};


export type MutationStartTimerArgs = {
  length: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  predefinedTimerId?: InputMaybe<Scalars['Int']>;
  soundFile?: InputMaybe<Scalars['String']>;
};

export type PredefinedTimer = {
  __typename?: 'PredefinedTimer';
  group?: Maybe<Group>;
  groupId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  length: Scalars['String'];
  name: Scalars['String'];
  soundFile?: Maybe<Scalars['String']>;
};

export enum PredefinedTimersSort {
  LastUsed = 'LAST_USED',
  Name = 'NAME'
}

export type Query = {
  __typename?: 'Query';
  brightness?: Maybe<Scalars['Int']>;
  config?: Maybe<AppConfig>;
  debugInfo?: Maybe<DebugInfo>;
  groups?: Maybe<Array<Maybe<Group>>>;
  ping?: Maybe<Scalars['String']>;
  predefinedTimers?: Maybe<Array<Maybe<PredefinedTimer>>>;
  runningTimers?: Maybe<Array<Maybe<RunningTimer>>>;
  settings?: Maybe<Settings>;
  timerEvents?: Maybe<Array<Maybe<TimerEvent>>>;
  timers?: Maybe<Array<Maybe<Timer>>>;
  weather?: Maybe<CurrentWeather>;
};


export type QueryPredefinedTimersArgs = {
  sortBy?: InputMaybe<PredefinedTimersSort>;
};


export type QueryWeatherArgs = {
  city: Scalars['String'];
};

export type RunningTimer = {
  __typename?: 'RunningTimer';
  elapsedTime?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  lengths?: Maybe<Array<Maybe<Scalars['Int']>>>;
  name?: Maybe<Scalars['String']>;
  origLength?: Maybe<Scalars['String']>;
  remainingTimes?: Maybe<Array<Maybe<Scalars['Int']>>>;
  state?: Maybe<TimerState>;
};

export type Settings = {
  __typename?: 'Settings';
  isAutoBacklightEnabled?: Maybe<Scalars['Boolean']>;
};

export type Sound = {
  __typename?: 'Sound';
  filename: Scalars['String'];
  title: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  runningTimers?: Maybe<Array<Maybe<RunningTimer>>>;
  timerEvents?: Maybe<Array<Maybe<TimerEvent>>>;
};

export type SystemStats = {
  __typename?: 'SystemStats';
  cpuTemp?: Maybe<Scalars['Float']>;
  load?: Maybe<Array<Maybe<Scalars['Float']>>>;
  memory?: Maybe<Memory>;
  uptime?: Maybe<Scalars['Int']>;
};

export type Timer = {
  __typename?: 'Timer';
  events?: Maybe<Array<Maybe<TimerEvent>>>;
  id: Scalars['Int'];
  length: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  predefinedTimerId?: Maybe<Scalars['Int']>;
  soundFile?: Maybe<Scalars['String']>;
};

export type TimerEvent = {
  __typename?: 'TimerEvent';
  id: Scalars['Int'];
  time?: Maybe<Scalars['DateTime']>;
  timer?: Maybe<Timer>;
  timerId?: Maybe<Scalars['Int']>;
  type: TimerEventType;
};

export enum TimerEventType {
  Alarm = 'ALARM',
  ClearAlarm = 'CLEAR_ALARM',
  Pause = 'PAUSE',
  Start = 'START',
  Stop = 'STOP'
}

export enum TimerOperation {
  ClearAlarm = 'CLEAR_ALARM',
  Pause = 'PAUSE',
  Stop = 'STOP',
  Unpause = 'UNPAUSE'
}

export enum TimerState {
  Paused = 'PAUSED',
  Started = 'STARTED'
}

export type ValidationResult = {
  __typename?: 'ValidationResult';
  errors?: Maybe<Array<Maybe<Error>>>;
};

export type Weather = {
  __typename?: 'Weather';
  config: Scalars['String'];
  type: Scalars['String'];
};

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'Query', config?: { __typename?: 'AppConfig', sounds: Array<{ __typename?: 'Sound', filename: string, title: string } | null> } | null };

export type TimerEventsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TimerEventsSubscription = { __typename?: 'Subscription', timerEvents?: Array<{ __typename?: 'TimerEvent', id: number, time?: any | null, type: TimerEventType, timer?: { __typename?: 'Timer', id: number, length: string, name?: string | null, soundFile?: string | null } | null } | null> | null };

export type RunningTimersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RunningTimersSubscription = { __typename?: 'Subscription', runningTimers?: Array<{ __typename?: 'RunningTimer', id?: number | null, name?: string | null, state?: TimerState | null, elapsedTime?: number | null, lengths?: Array<number | null> | null, remainingTimes?: Array<number | null> | null, origLength?: string | null } | null> | null };

export type GroupListQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupListQuery = { __typename?: 'Query', groups?: Array<{ __typename?: 'Group', id: number, name: string } | null> | null };

export type PredefinedTimerListQueryVariables = Exact<{ [key: string]: never; }>;


export type PredefinedTimerListQuery = { __typename?: 'Query', predefinedTimers?: Array<{ __typename?: 'PredefinedTimer', name: string, length: string, id: number, soundFile?: string | null, group?: { __typename?: 'Group', id: number, name: string } | null } | null> | null };

export type StartTimerMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  length: Scalars['String'];
  predefinedTimerId?: InputMaybe<Scalars['Int']>;
  soundFile: Scalars['String'];
}>;


export type StartTimerMutation = { __typename?: 'Mutation', startTimer?: { __typename?: 'InstanceResult', id?: number | null, errors?: Array<{ __typename?: 'Error', path?: Array<string | null> | null, type?: string | null, context?: any | null } | null> | null } | null };

export type SavePredefinedTimerMutationVariables = Exact<{
  name: Scalars['String'];
  length: Scalars['String'];
  groupName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  soundFile?: InputMaybe<Scalars['String']>;
}>;


export type SavePredefinedTimerMutation = { __typename?: 'Mutation', savePredefinedTimer?: { __typename?: 'InstanceResult', id?: number | null, errors?: Array<{ __typename?: 'Error', context?: any | null, path?: Array<string | null> | null, type?: string | null } | null> | null } | null };

export type TimerEventListQueryVariables = Exact<{ [key: string]: never; }>;


export type TimerEventListQuery = { __typename?: 'Query', timerEvents?: Array<{ __typename?: 'TimerEvent', id: number, time?: any | null, type: TimerEventType, timer?: { __typename?: 'Timer', name?: string | null, length: string } | null } | null> | null };

export type TimerOperationMutationVariables = Exact<{
  id: Scalars['Int'];
  operation: TimerOperation;
}>;


export type TimerOperationMutation = { __typename?: 'Mutation', operateTimer?: { __typename?: 'ValidationResult', errors?: Array<{ __typename?: 'Error', type?: string | null } | null> | null } | null };

export type CurrentWeatherQueryVariables = Exact<{
  city: Scalars['String'];
}>;


export type CurrentWeatherQuery = { __typename?: 'Query', weather?: { __typename?: 'CurrentWeather', temperature?: number | null, conditionsImageUrl?: string | null } | null };

export type QuickTimerListQueryVariables = Exact<{ [key: string]: never; }>;


export type QuickTimerListQuery = { __typename?: 'Query', predefinedTimers?: Array<{ __typename?: 'PredefinedTimer', name: string, length: string, id: number, soundFile?: string | null, group?: { __typename?: 'Group', name: string } | null } | null> | null };

export type DeleteTimerMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteTimerMutation = { __typename?: 'Mutation', deletePredefinedTimer?: { __typename?: 'InstanceResult', id?: number | null } | null };

export type GetBrightnessQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBrightnessQuery = { __typename?: 'Query', brightness?: number | null, settings?: { __typename?: 'Settings', isAutoBacklightEnabled?: boolean | null } | null };

export type SetBrightnessMutationVariables = Exact<{
  brightness: Scalars['Int'];
}>;


export type SetBrightnessMutation = { __typename?: 'Mutation', setBrightness?: boolean | null };

export type SetAutoBacklightEnabledMutationVariables = Exact<{
  isAutoEnabled: Scalars['Boolean'];
}>;


export type SetAutoBacklightEnabledMutation = { __typename?: 'Mutation', saveSettings?: boolean | null };

export type CeleryInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type CeleryInfoQuery = { __typename?: 'Query', debugInfo?: { __typename?: 'DebugInfo', celeryTasks?: { __typename?: 'CeleryTaskList', alarm?: Array<{ __typename?: 'AlarmTask', eta?: string | null, isLast?: boolean | null, isRevoked?: boolean | null, timerId?: number | null } | null> | null } | null } | null };

export type DebugInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type DebugInfoQuery = { __typename?: 'Query', debugInfo?: { __typename?: 'DebugInfo', systemStats?: { __typename?: 'SystemStats', load?: Array<number | null> | null, uptime?: number | null, cpuTemp?: number | null, memory?: { __typename?: 'Memory', percent?: number | null } | null } | null } | null };


export const ConfigDocument = gql`
    query Config {
  config {
    sounds {
      filename
      title
    }
  }
}
    `;

/**
 * __useConfigQuery__
 *
 * To run a query within a React component, call `useConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfigQuery(baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
      }
export function useConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
        }
export type ConfigQueryHookResult = ReturnType<typeof useConfigQuery>;
export type ConfigLazyQueryHookResult = ReturnType<typeof useConfigLazyQuery>;
export type ConfigQueryResult = Apollo.QueryResult<ConfigQuery, ConfigQueryVariables>;
export const TimerEventsDocument = gql`
    subscription TimerEvents {
  timerEvents {
    id
    time
    type
    timer {
      id
      length
      name
      soundFile
    }
  }
}
    `;

/**
 * __useTimerEventsSubscription__
 *
 * To run a query within a React component, call `useTimerEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTimerEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimerEventsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTimerEventsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TimerEventsSubscription, TimerEventsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TimerEventsSubscription, TimerEventsSubscriptionVariables>(TimerEventsDocument, options);
      }
export type TimerEventsSubscriptionHookResult = ReturnType<typeof useTimerEventsSubscription>;
export type TimerEventsSubscriptionResult = Apollo.SubscriptionResult<TimerEventsSubscription>;
export const RunningTimersDocument = gql`
    subscription RunningTimers {
  runningTimers {
    id
    name
    state
    elapsedTime
    lengths
    remainingTimes
    origLength
  }
}
    `;

/**
 * __useRunningTimersSubscription__
 *
 * To run a query within a React component, call `useRunningTimersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRunningTimersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunningTimersSubscription({
 *   variables: {
 *   },
 * });
 */
export function useRunningTimersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<RunningTimersSubscription, RunningTimersSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RunningTimersSubscription, RunningTimersSubscriptionVariables>(RunningTimersDocument, options);
      }
export type RunningTimersSubscriptionHookResult = ReturnType<typeof useRunningTimersSubscription>;
export type RunningTimersSubscriptionResult = Apollo.SubscriptionResult<RunningTimersSubscription>;
export const GroupListDocument = gql`
    query GroupList {
  groups {
    id
    name
  }
}
    `;

/**
 * __useGroupListQuery__
 *
 * To run a query within a React component, call `useGroupListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupListQuery(baseOptions?: Apollo.QueryHookOptions<GroupListQuery, GroupListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GroupListQuery, GroupListQueryVariables>(GroupListDocument, options);
      }
export function useGroupListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupListQuery, GroupListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GroupListQuery, GroupListQueryVariables>(GroupListDocument, options);
        }
export type GroupListQueryHookResult = ReturnType<typeof useGroupListQuery>;
export type GroupListLazyQueryHookResult = ReturnType<typeof useGroupListLazyQuery>;
export type GroupListQueryResult = Apollo.QueryResult<GroupListQuery, GroupListQueryVariables>;
export const PredefinedTimerListDocument = gql`
    query PredefinedTimerList {
  predefinedTimers {
    name
    length
    id
    soundFile
    group {
      id
      name
    }
  }
}
    `;

/**
 * __usePredefinedTimerListQuery__
 *
 * To run a query within a React component, call `usePredefinedTimerListQuery` and pass it any options that fit your needs.
 * When your component renders, `usePredefinedTimerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePredefinedTimerListQuery({
 *   variables: {
 *   },
 * });
 */
export function usePredefinedTimerListQuery(baseOptions?: Apollo.QueryHookOptions<PredefinedTimerListQuery, PredefinedTimerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PredefinedTimerListQuery, PredefinedTimerListQueryVariables>(PredefinedTimerListDocument, options);
      }
export function usePredefinedTimerListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PredefinedTimerListQuery, PredefinedTimerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PredefinedTimerListQuery, PredefinedTimerListQueryVariables>(PredefinedTimerListDocument, options);
        }
export type PredefinedTimerListQueryHookResult = ReturnType<typeof usePredefinedTimerListQuery>;
export type PredefinedTimerListLazyQueryHookResult = ReturnType<typeof usePredefinedTimerListLazyQuery>;
export type PredefinedTimerListQueryResult = Apollo.QueryResult<PredefinedTimerListQuery, PredefinedTimerListQueryVariables>;
export const StartTimerDocument = gql`
    mutation StartTimer($name: String, $length: String!, $predefinedTimerId: Int, $soundFile: String!) {
  startTimer(
    name: $name
    length: $length
    predefinedTimerId: $predefinedTimerId
    soundFile: $soundFile
  ) {
    id
    errors {
      path
      type
      context
    }
  }
}
    `;
export type StartTimerMutationFn = Apollo.MutationFunction<StartTimerMutation, StartTimerMutationVariables>;

/**
 * __useStartTimerMutation__
 *
 * To run a mutation, you first call `useStartTimerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartTimerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startTimerMutation, { data, loading, error }] = useStartTimerMutation({
 *   variables: {
 *      name: // value for 'name'
 *      length: // value for 'length'
 *      predefinedTimerId: // value for 'predefinedTimerId'
 *      soundFile: // value for 'soundFile'
 *   },
 * });
 */
export function useStartTimerMutation(baseOptions?: Apollo.MutationHookOptions<StartTimerMutation, StartTimerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartTimerMutation, StartTimerMutationVariables>(StartTimerDocument, options);
      }
export type StartTimerMutationHookResult = ReturnType<typeof useStartTimerMutation>;
export type StartTimerMutationResult = Apollo.MutationResult<StartTimerMutation>;
export type StartTimerMutationOptions = Apollo.BaseMutationOptions<StartTimerMutation, StartTimerMutationVariables>;
export const SavePredefinedTimerDocument = gql`
    mutation SavePredefinedTimer($name: String!, $length: String!, $groupName: String, $id: Int, $soundFile: String) {
  savePredefinedTimer(
    name: $name
    length: $length
    groupName: $groupName
    id: $id
    soundFile: $soundFile
  ) {
    id
    errors {
      context
      path
      type
    }
  }
}
    `;
export type SavePredefinedTimerMutationFn = Apollo.MutationFunction<SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables>;

/**
 * __useSavePredefinedTimerMutation__
 *
 * To run a mutation, you first call `useSavePredefinedTimerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSavePredefinedTimerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [savePredefinedTimerMutation, { data, loading, error }] = useSavePredefinedTimerMutation({
 *   variables: {
 *      name: // value for 'name'
 *      length: // value for 'length'
 *      groupName: // value for 'groupName'
 *      id: // value for 'id'
 *      soundFile: // value for 'soundFile'
 *   },
 * });
 */
export function useSavePredefinedTimerMutation(baseOptions?: Apollo.MutationHookOptions<SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables>(SavePredefinedTimerDocument, options);
      }
export type SavePredefinedTimerMutationHookResult = ReturnType<typeof useSavePredefinedTimerMutation>;
export type SavePredefinedTimerMutationResult = Apollo.MutationResult<SavePredefinedTimerMutation>;
export type SavePredefinedTimerMutationOptions = Apollo.BaseMutationOptions<SavePredefinedTimerMutation, SavePredefinedTimerMutationVariables>;
export const TimerEventListDocument = gql`
    query TimerEventList {
  timerEvents {
    id
    time
    type
    timer {
      name
      length
    }
  }
}
    `;

/**
 * __useTimerEventListQuery__
 *
 * To run a query within a React component, call `useTimerEventListQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimerEventListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimerEventListQuery({
 *   variables: {
 *   },
 * });
 */
export function useTimerEventListQuery(baseOptions?: Apollo.QueryHookOptions<TimerEventListQuery, TimerEventListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimerEventListQuery, TimerEventListQueryVariables>(TimerEventListDocument, options);
      }
export function useTimerEventListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimerEventListQuery, TimerEventListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimerEventListQuery, TimerEventListQueryVariables>(TimerEventListDocument, options);
        }
export type TimerEventListQueryHookResult = ReturnType<typeof useTimerEventListQuery>;
export type TimerEventListLazyQueryHookResult = ReturnType<typeof useTimerEventListLazyQuery>;
export type TimerEventListQueryResult = Apollo.QueryResult<TimerEventListQuery, TimerEventListQueryVariables>;
export const TimerOperationDocument = gql`
    mutation TimerOperation($id: Int!, $operation: TimerOperation!) {
  operateTimer(id: $id, operation: $operation) {
    errors {
      type
    }
  }
}
    `;
export type TimerOperationMutationFn = Apollo.MutationFunction<TimerOperationMutation, TimerOperationMutationVariables>;

/**
 * __useTimerOperationMutation__
 *
 * To run a mutation, you first call `useTimerOperationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTimerOperationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [timerOperationMutation, { data, loading, error }] = useTimerOperationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      operation: // value for 'operation'
 *   },
 * });
 */
export function useTimerOperationMutation(baseOptions?: Apollo.MutationHookOptions<TimerOperationMutation, TimerOperationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TimerOperationMutation, TimerOperationMutationVariables>(TimerOperationDocument, options);
      }
export type TimerOperationMutationHookResult = ReturnType<typeof useTimerOperationMutation>;
export type TimerOperationMutationResult = Apollo.MutationResult<TimerOperationMutation>;
export type TimerOperationMutationOptions = Apollo.BaseMutationOptions<TimerOperationMutation, TimerOperationMutationVariables>;
export const CurrentWeatherDocument = gql`
    query CurrentWeather($city: String!) {
  weather(city: $city) {
    temperature
    conditionsImageUrl
  }
}
    `;

/**
 * __useCurrentWeatherQuery__
 *
 * To run a query within a React component, call `useCurrentWeatherQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentWeatherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentWeatherQuery({
 *   variables: {
 *      city: // value for 'city'
 *   },
 * });
 */
export function useCurrentWeatherQuery(baseOptions: Apollo.QueryHookOptions<CurrentWeatherQuery, CurrentWeatherQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentWeatherQuery, CurrentWeatherQueryVariables>(CurrentWeatherDocument, options);
      }
export function useCurrentWeatherLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentWeatherQuery, CurrentWeatherQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentWeatherQuery, CurrentWeatherQueryVariables>(CurrentWeatherDocument, options);
        }
export type CurrentWeatherQueryHookResult = ReturnType<typeof useCurrentWeatherQuery>;
export type CurrentWeatherLazyQueryHookResult = ReturnType<typeof useCurrentWeatherLazyQuery>;
export type CurrentWeatherQueryResult = Apollo.QueryResult<CurrentWeatherQuery, CurrentWeatherQueryVariables>;
export const QuickTimerListDocument = gql`
    query QuickTimerList {
  predefinedTimers(sortBy: LAST_USED) {
    name
    length
    id
    soundFile
    group {
      name
    }
  }
}
    `;

/**
 * __useQuickTimerListQuery__
 *
 * To run a query within a React component, call `useQuickTimerListQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuickTimerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuickTimerListQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuickTimerListQuery(baseOptions?: Apollo.QueryHookOptions<QuickTimerListQuery, QuickTimerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuickTimerListQuery, QuickTimerListQueryVariables>(QuickTimerListDocument, options);
      }
export function useQuickTimerListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuickTimerListQuery, QuickTimerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuickTimerListQuery, QuickTimerListQueryVariables>(QuickTimerListDocument, options);
        }
export type QuickTimerListQueryHookResult = ReturnType<typeof useQuickTimerListQuery>;
export type QuickTimerListLazyQueryHookResult = ReturnType<typeof useQuickTimerListLazyQuery>;
export type QuickTimerListQueryResult = Apollo.QueryResult<QuickTimerListQuery, QuickTimerListQueryVariables>;
export const DeleteTimerDocument = gql`
    mutation DeleteTimer($id: Int!) {
  deletePredefinedTimer(id: $id) {
    id
  }
}
    `;
export type DeleteTimerMutationFn = Apollo.MutationFunction<DeleteTimerMutation, DeleteTimerMutationVariables>;

/**
 * __useDeleteTimerMutation__
 *
 * To run a mutation, you first call `useDeleteTimerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimerMutation, { data, loading, error }] = useDeleteTimerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTimerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimerMutation, DeleteTimerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimerMutation, DeleteTimerMutationVariables>(DeleteTimerDocument, options);
      }
export type DeleteTimerMutationHookResult = ReturnType<typeof useDeleteTimerMutation>;
export type DeleteTimerMutationResult = Apollo.MutationResult<DeleteTimerMutation>;
export type DeleteTimerMutationOptions = Apollo.BaseMutationOptions<DeleteTimerMutation, DeleteTimerMutationVariables>;
export const GetBrightnessDocument = gql`
    query GetBrightness {
  brightness
  settings {
    isAutoBacklightEnabled
  }
}
    `;

/**
 * __useGetBrightnessQuery__
 *
 * To run a query within a React component, call `useGetBrightnessQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBrightnessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBrightnessQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBrightnessQuery(baseOptions?: Apollo.QueryHookOptions<GetBrightnessQuery, GetBrightnessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBrightnessQuery, GetBrightnessQueryVariables>(GetBrightnessDocument, options);
      }
export function useGetBrightnessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBrightnessQuery, GetBrightnessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBrightnessQuery, GetBrightnessQueryVariables>(GetBrightnessDocument, options);
        }
export type GetBrightnessQueryHookResult = ReturnType<typeof useGetBrightnessQuery>;
export type GetBrightnessLazyQueryHookResult = ReturnType<typeof useGetBrightnessLazyQuery>;
export type GetBrightnessQueryResult = Apollo.QueryResult<GetBrightnessQuery, GetBrightnessQueryVariables>;
export const SetBrightnessDocument = gql`
    mutation SetBrightness($brightness: Int!) {
  setBrightness(brightness: $brightness)
}
    `;
export type SetBrightnessMutationFn = Apollo.MutationFunction<SetBrightnessMutation, SetBrightnessMutationVariables>;

/**
 * __useSetBrightnessMutation__
 *
 * To run a mutation, you first call `useSetBrightnessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetBrightnessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setBrightnessMutation, { data, loading, error }] = useSetBrightnessMutation({
 *   variables: {
 *      brightness: // value for 'brightness'
 *   },
 * });
 */
export function useSetBrightnessMutation(baseOptions?: Apollo.MutationHookOptions<SetBrightnessMutation, SetBrightnessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetBrightnessMutation, SetBrightnessMutationVariables>(SetBrightnessDocument, options);
      }
export type SetBrightnessMutationHookResult = ReturnType<typeof useSetBrightnessMutation>;
export type SetBrightnessMutationResult = Apollo.MutationResult<SetBrightnessMutation>;
export type SetBrightnessMutationOptions = Apollo.BaseMutationOptions<SetBrightnessMutation, SetBrightnessMutationVariables>;
export const SetAutoBacklightEnabledDocument = gql`
    mutation SetAutoBacklightEnabled($isAutoEnabled: Boolean!) {
  saveSettings(isAutoBacklightEnabled: $isAutoEnabled)
}
    `;
export type SetAutoBacklightEnabledMutationFn = Apollo.MutationFunction<SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables>;

/**
 * __useSetAutoBacklightEnabledMutation__
 *
 * To run a mutation, you first call `useSetAutoBacklightEnabledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAutoBacklightEnabledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAutoBacklightEnabledMutation, { data, loading, error }] = useSetAutoBacklightEnabledMutation({
 *   variables: {
 *      isAutoEnabled: // value for 'isAutoEnabled'
 *   },
 * });
 */
export function useSetAutoBacklightEnabledMutation(baseOptions?: Apollo.MutationHookOptions<SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables>(SetAutoBacklightEnabledDocument, options);
      }
export type SetAutoBacklightEnabledMutationHookResult = ReturnType<typeof useSetAutoBacklightEnabledMutation>;
export type SetAutoBacklightEnabledMutationResult = Apollo.MutationResult<SetAutoBacklightEnabledMutation>;
export type SetAutoBacklightEnabledMutationOptions = Apollo.BaseMutationOptions<SetAutoBacklightEnabledMutation, SetAutoBacklightEnabledMutationVariables>;
export const CeleryInfoDocument = gql`
    query CeleryInfo {
  debugInfo {
    celeryTasks {
      alarm {
        eta
        isLast
        isRevoked
        timerId
      }
    }
  }
}
    `;

/**
 * __useCeleryInfoQuery__
 *
 * To run a query within a React component, call `useCeleryInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCeleryInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCeleryInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useCeleryInfoQuery(baseOptions?: Apollo.QueryHookOptions<CeleryInfoQuery, CeleryInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CeleryInfoQuery, CeleryInfoQueryVariables>(CeleryInfoDocument, options);
      }
export function useCeleryInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CeleryInfoQuery, CeleryInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CeleryInfoQuery, CeleryInfoQueryVariables>(CeleryInfoDocument, options);
        }
export type CeleryInfoQueryHookResult = ReturnType<typeof useCeleryInfoQuery>;
export type CeleryInfoLazyQueryHookResult = ReturnType<typeof useCeleryInfoLazyQuery>;
export type CeleryInfoQueryResult = Apollo.QueryResult<CeleryInfoQuery, CeleryInfoQueryVariables>;
export const DebugInfoDocument = gql`
    query DebugInfo {
  debugInfo {
    systemStats {
      load
      memory {
        percent
      }
      uptime
      cpuTemp
    }
  }
}
    `;

/**
 * __useDebugInfoQuery__
 *
 * To run a query within a React component, call `useDebugInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebugInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebugInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useDebugInfoQuery(baseOptions?: Apollo.QueryHookOptions<DebugInfoQuery, DebugInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebugInfoQuery, DebugInfoQueryVariables>(DebugInfoDocument, options);
      }
export function useDebugInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebugInfoQuery, DebugInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebugInfoQuery, DebugInfoQueryVariables>(DebugInfoDocument, options);
        }
export type DebugInfoQueryHookResult = ReturnType<typeof useDebugInfoQuery>;
export type DebugInfoLazyQueryHookResult = ReturnType<typeof useDebugInfoLazyQuery>;
export type DebugInfoQueryResult = Apollo.QueryResult<DebugInfoQuery, DebugInfoQueryVariables>;