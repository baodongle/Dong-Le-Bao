/* eslint-disable arrow-return-style/arrow-return-style */
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import { useForm, useStore } from '@tanstack/react-form';
import { useTokenPrices } from '@/entities/token/api';
import { useSwapMutation } from '@/pages/swap/api';
import {
  ArrowDownUpIcon,
  Button,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldError,
  FieldGroup,
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
  NumericInput,
  ShineBorder,
  Spinner
} from '@/shared/ui';
import { calculateExchangeAmount, calculateExchangeRate } from '../lib/utils';
import { swapFormSchema, type SwapFormValues } from '../model';
import { TokenContent, TokenSelector, TokenTrigger } from './TokenSelector';

export function CurrencySwapForm() {
  const { data: tokens = [] } = useTokenPrices();
  const swapMutation = useSwapMutation();
  const form = useForm({
    defaultValues: {
      fromAmount: '',
    } as SwapFormValues,
    validators: {
      onChange: swapFormSchema,
    },
    onSubmit: ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const exchangeRate = calculateExchangeRate(
        value.fromToken,
        value.toToken,
      );
      const amount = calculateExchangeAmount(
        Number(value.fromAmount),
        exchangeRate,
      );

      swapMutation.mutate(
        {
          fromCurrency: value.fromToken.currency,
          toCurrency: value.toToken.currency,
          fromAmount: Number(value.fromAmount),
          toAmount: amount ?? 0,
          rate: exchangeRate?.rate ?? 0,
        },
        {
          onSuccess: () => {
            toast.success('Swap successful!');
          },
          onError: () => {
            toast.error('Transaction failed. Please try again.');
          },
        },
      );
    },
  });
  const fromValue = useStore(form.store, (state) => {
    const { fromToken, fromAmount } = state.values;
    let value: number;

    if (!fromToken || !fromAmount) {
      value = 0;
    } else {
      value = Number(fromAmount) * fromToken.price;
    }

    return value;
  });
  const exchangeRate = useStore(form.store, (state) => {
    return calculateExchangeRate(state.values.fromToken, state.values.toToken);
  });
  const toAmount = useStore(form.store, (state) => {
    return calculateExchangeAmount(
      Number(state.values.fromAmount),
      exchangeRate,
    );
  });

  const handleSwitchTokens = () => {
    const currentFromToken = form.getFieldValue('fromToken');
    const currentToToken = form.getFieldValue('toToken');

    if (!currentFromToken || !currentToToken) {
      return;
    }

    form.setFieldValue('fromToken', currentToToken);
    form.setFieldValue('toToken', currentFromToken);
  };

  return (
    <Card className="relative w-full sm:max-w-md">
      <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
      <CardContent>
        <form
          id="fancy-form"
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-2">
            <Item variant="outline" className="relative">
              <ItemHeader>
                <ItemTitle>Send</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <div className="grid grid-cols-2 gap-2">
                  <form.Field
                    name="fromAmount"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <NumericInput
                            thousandSeparator
                            className="h-12"
                            id={field.name}
                            name={field.name}
                            placeholder="0.00"
                            value={field.state.value}
                            autoComplete="off"
                            decimalScale={2}
                            aria-invalid={isInvalid}
                            onBlur={field.handleBlur}
                            onValueChange={(values) => {
                              field.handleChange(values.value);
                            }}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="fromToken"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <TokenSelector
                            tokens={tokens}
                            selectedTokenName={field.state.value?.currency}
                            onTokenChange={field.handleChange}
                          >
                            <TokenTrigger />
                            <TokenContent />
                          </TokenSelector>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <NumericFormat
                    readOnly
                    thousandSeparator
                    className="text-right"
                    decimalScale={2}
                    prefix="Value: $"
                    value={fromValue}
                  />
                </div>
              </ItemContent>
              <div className="absolute -bottom-1 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Switch"
                  className="rounded-full"
                  onClick={handleSwitchTokens}
                >
                  <ArrowDownUpIcon />
                </Button>
              </div>
            </Item>

            <Item variant="outline">
              <ItemHeader>
                <ItemTitle>Receive</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <NumericInput
                      readOnly
                      thousandSeparator
                      decimalScale={2}
                      value={toAmount}
                      className="h-12"
                    />
                  </Field>
                  <form.Field
                    name="toToken"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <TokenSelector
                            tokens={tokens}
                            selectedTokenName={field.state.value?.currency}
                            onTokenChange={field.handleChange}
                          >
                            <TokenTrigger />
                            <TokenContent />
                          </TokenSelector>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </ItemContent>
            </Item>

            {exchangeRate && (
              <div className="flex justify-end text-sm">
                <NumericFormat
                  readOnly
                  thousandSeparator
                  className="w-3xs text-right"
                  decimalScale={6}
                  prefix={`1 ${exchangeRate.fromCurrency} = `}
                  value={exchangeRate.rate}
                  suffix={` ${exchangeRate.toCurrency}`}
                />
              </div>
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <form.Subscribe
          selector={(state) => [
            state.isPristine,
            state.canSubmit,
            state.isSubmitting,
          ]}
          children={([isPristine, canSubmit, isSubmitting]) => {
            return (
              <Field>
                <Button
                  form="fancy-form"
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isPristine}
                >
                  {(isSubmitting || swapMutation.isPending) && <Spinner />}
                  Swap
                </Button>
              </Field>
            );
          }}
        />
      </CardFooter>
    </Card>
  );
}
