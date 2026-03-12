import { Badge } from '@/components/ui';

interface Props {
    value: boolean;
    trueLabel?: string;
    falseLabel?: string;
}

export function BoolBadge({ value, trueLabel = 'Sí', falseLabel = 'No' }: Props) {
    return (
        <Badge variant={value ? 'default' : 'secondary'}>
            {value ? trueLabel : falseLabel}
        </Badge>
    );
}
